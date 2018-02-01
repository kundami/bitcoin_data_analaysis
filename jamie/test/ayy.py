import tensorflow as tf
import keras
import numpy
import matplotlib.pyplot as plt
from pandas import read_csv
import math
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error
import os
import json
import numpy as np
import pandas as pd
import pickle
import quandl
from datetime import datetime
from dateutil.parser import parse
from itertools import chain
import operator
import sys
import plotly
import plotly.offline as py
import plotly.graph_objs as go
import plotly.figure_factory as ff
py.init_notebook_mode(connected=True)

from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

btc_data = pd.read_csv("data_final.csv")
btc_data.set_index('Date', inplace=True)

def series_to_supervised(data, n_in=1, n_out=1, dropnan=True):
    n_vars = 1 if type(data) is list else data.shape[1]
    df = pd.DataFrame(data)
    df.head()
    cols, names = list(), list()
    # input sequence (t-n, ... t-1)
    for i in range(n_in, 0, -1):
        cols.append(df.shift(i))
        names += [('var%d(t-%d)' % (j+1, i)) for j in range(n_vars)]
    # forecast sequence (t, t+1, ... t+n)
    for i in range(0, n_out):
        cols.append(df.shift(-i))
        if i == 0:
            names += [('var%d(t)' % (j+1)) for j in range(n_vars)]
        else:
            names += [('var%d(t+%d)' % (j+1, i)) for j in range(n_vars)]
    # put it all together
    agg = pd.concat(cols, axis=1)
    agg.columns = names
    # drop rows with NaN values
    if dropnan:
        agg.dropna(inplace=True)
    return agg

def plot(actual,predict,real_data,columns,title):
# lot_data(predicted, actual, future, cols,title)
    df = pd.DataFrame(real_data)
    data_series = df["Date"]
    # print("Here")
    # lot_data(predicted, actual, future, cols,title)
    df = pd.DataFrame(real_data)
    
    trace1 = go.Scatter(
        x=data_series,
        y=actual,
        name='Actual Close'
    )
    #Lower_closing  Upper_closing
    trace2 = go.Scatter(
        x=data_series,
        y=predict,
        name='Predicted Close',
        fill=None,
        mode='lines',
        line=dict(color='rgb(143,19,131)'),        
       
    )
    data = [trace1, trace2]
    layout = go.Layout(
        title='Actual Vs Predicted using Google TensorFlow RNN',
        yaxis=dict(
            title='Closing Price'
        ),
        yaxis2=dict(
            title='yaxis2 title',
            titlefont=dict(
                color='rgb(148, 103, 189)'
            ),
            tickfont=dict(
                color='rgb(148, 103, 189)'
            ),
            overlaying='y',
            side='right'
        )
    )
    graph = go.Figure(data=data, layout=layout)
    return graph

@app.route("/")
def index():

    values = btc_data.values
    encoder = LabelEncoder()
    values[:,4] = encoder.fit_transform(values[:,4])

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled = scaler.fit_transform(values)

    reframed = series_to_supervised(scaled, 1, 1)
    reframed.drop(reframed.columns[[12,13,14,16,17,18,19,20,21,22,23]], axis=1, inplace=True)

    timeseries_values = reframed.values
    n_train_hours = 650
    train = timeseries_values[:n_train_hours, :]
    test = timeseries_values[n_train_hours:, :]
    train_X, train_y = train[:, :-1], train[:, -1]
    test_X, test_y = test[:, :-1], test[:, -1]
    train_X = train_X.reshape((train_X.shape[0], 1, train_X.shape[1]))
    test_X = test_X.reshape((test_X.shape[0], 1, test_X.shape[1]))
    train_X_orig, train_y_orig = train[:, :-1], train[:, -1]
    test_X_orig, test_y_orig = test[:, :-1], test[:, -1]

    model = Sequential()
    model.add(LSTM(50, input_shape=(train_X.shape[1], train_X.shape[2])))
    model.add(Dense(1))
    model.compile(loss='mse', optimizer='adam') #mae
    ### fit network
    history = model.fit(train_X, train_y, epochs=50, batch_size=72, validation_data=(test_X, test_y), verbose=2, shuffle=False)

    ypred = model.predict(test_X)
    test_X_revert = test_X.reshape((test_X.shape[0], test_X.shape[2]))
    inv_ypred = np.concatenate((ypred, test_X_revert[:, 1:]), axis=1)
    inv_ypred = scaler.inverse_transform(inv_ypred)
    inv_yhat = inv_ypred[:,0]

    test_y_revert = test_y.reshape((len(test_y), 1))
    inv_yorig = np.concatenate((test_y_revert, test_X_revert[:, 1:]), axis=1)
    inv_yorig = scaler.inverse_transform(inv_yorig)
    inv_y = inv_yorig[:,0]
    # rmse = np.sqrt(mean_squared_error(inv_y, inv_yhat))

    cols = ["Mean", "Lower_closing", "Upper_closing"]
    title = "Closing price distribution of bitcoin"
    btc_data.reset_index(inplace=True)
    real_data = btc_data[651:len(btc_data)]

    # Convert the figures to JSON
    graphJSON = json.dumps(plot(inv_y,inv_yhat, real_data, cols ,title), cls=plotly.utils.PlotlyJSONEncoder)
    return render_template('index.html', graphJSON=graphJSON)

@app.route('/ayy', methods = ["GET", "POST"])
def my_form_post():
    response_list = request.form.getlist("chk_box")
    return jsonify(response_list)

if __name__ == '__main__':
    app.run(debug=True)

# https://github.com/ecerami/hello_flask/blob/master/app.py
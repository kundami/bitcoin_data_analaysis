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
import datetime
from dateutil.parser import parse
from itertools import chain
import operator
import sys
import plotly
import plotly.offline as py
import plotly.graph_objs as go
import plotly.figure_factory as ff
from fbprophet import Prophet
py.init_notebook_mode(connected=True)

from flask import Flask, render_template, request, jsonify
import flask
app = Flask(__name__)

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
    data_series = df.index.tolist()
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
        title='Actual vs Predicted Using Google TensorFlow RNN',
        yaxis=dict(
            title='Closing Price'
        ),
    )
    graph = go.Figure(data=data, layout=layout)
    return graph

def plot_fb(df,X,future,columns,title):

# lot_data(predicted, actual, future, cols,title)
    trace1 = go.Scatter(
        x=future['ds'],
        y=X,
        name='Actual Close'
    )
    #Lower_closing  Upper_closing
    trace2 = go.Scatter(
        x=future['ds'],
        y=df['Upper_closing'],
        name='Predicted Close Upper Bound',
        fill=None,
        mode='lines',
        line=dict(color='rgb(143,19,131)'),        
       
    )
    trace3 = go.Scatter(
        x=future['ds'],
        y=df['Lower_closing'],
        name='Predicted Close Lower Bound',
        fill='tonexty',
        mode='lines',
        line=dict(color='rgb(143,19,131)')
    )

    data = [trace1, trace2, trace3]
    layout = go.Layout(
        title='Actual Vs Predicted using FBProphet',
        yaxis=dict(
            title='Closing Price'
        )
    )
    fig = go.Figure(data=data, layout=layout)
    return fig

# date_string = YYYY-MM-DD
def date_parse(date_string):
    date_list = date_string.split('-')
    date_index_0 = datetime.date(2016, 1, 1)
    date = datetime.date(int(date_list[0]),int(date_list[1]),int(date_list[2]))
    diff = date - date_index_0
    return diff.days

btc_data = pd.read_csv("data_final.csv")
btc_data.set_index('Date', inplace=True)

@app.route('/', methods = ["GET", "POST"])
def test():
    btc_data_new = btc_data
    date_index = 639
    if flask.request.method == 'POST':
        test_list = request.form.getlist("chk_box")
        date_index = date_parse(request.form.get('date'))
        print(date_index)
        print(test_list)
        btc_data_new = btc_data_new[test_list]
        
    close_var = "var{}(t)".format(list(btc_data_new.columns.values).index('close')+1)
    
    values = btc_data_new.values
    encoder = LabelEncoder()
    values[:,4] = encoder.fit_transform(values[:,4])

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled = scaler.fit_transform(values)

    reframed = series_to_supervised(scaled, 1, 1)
    for var_name in reframed.columns.values:
        if "(t)" in var_name and var_name != close_var:
            reframed.drop(var_name, axis=1, inplace=True)
    print(reframed.columns.values)
    
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

    cols = ["Mean", "Lower_closing", "Upper_closing"]
    title = "Closing price distribution of bitcoin"
    real_data = btc_data_new[date_index:len(btc_data_new)]
    print(real_data.columns.values)


    btc_data_fb = btc_data
    btc_data_fb['y'] = np.log(btc_data_fb['close'])
    btc_data_fb['ds'] = btc_data_fb.index
    fb_reg_data = btc_data_fb.loc[:,['ds','y']]
    fb_reg_data = fb_reg_data.reset_index(drop=True)
    fb_reg_data.dropna(inplace=True)
    # from 10/1/2017
    fb_reg_data_new = fb_reg_data[date_index:]

    m = Prophet(changepoint_prior_scale = 0.5)
    m.fit(fb_reg_data_new)
    # predict till 1/3/2018 from end of data 12/31/2017
    future = m.make_future_dataframe(periods=3)
    forecast = m.predict(future)
    predicted  = forecast[['yhat', 'yhat_lower', 'yhat_upper']].applymap(np.exp)
    cols = ["Mean", "Lower_closing", "Upper_closing"]
    predicted.columns = cols
    actual = np.exp(fb_reg_data_new["y"])
    actual.name = "Actual"
    title = "Closing Price Distribution of Bitcoin"

    # Convert the figures to JSON
    graphJSON = json.dumps(plot(inv_y,inv_yhat, real_data, cols ,title), cls=plotly.utils.PlotlyJSONEncoder)
    graphJSON_fb = json.dumps(plot_fb(predicted, actual, future, cols,title), cls=plotly.utils.PlotlyJSONEncoder)
    return render_template('test.html', graphJSON=graphJSON, graphJSON_fb=graphJSON_fb)

if __name__ == '__main__':
    app.run(debug=True)

# https://github.com/ecerami/hello_flask/blob/master/app.py
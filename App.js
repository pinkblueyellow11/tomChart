import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './Screen/Home.js';

const AppNavigator = createStackNavigator({
  Home,
});

const AppContainer = createAppContainer(AppNavigator);


export default class App extends React.Component {


  render() {
    return <AppContainer />;
  }
}
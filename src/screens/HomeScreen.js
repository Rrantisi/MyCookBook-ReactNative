import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Discover from './Discover';
import MyKitchen from './MyKitchen';

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: 'white' }} >
    <Discover />
  </View>
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: 'white' }} >
    <MyKitchen />
  </View>
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function HomeScreen() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  // no need for a setter function for routes 
  const [routes] = React.useState([
    { key: 'first', title: 'Discover' },
    { key: 'second', title: 'My Kitchen' },
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#FFFBF6' }}
      style={{ backgroundColor: '#212121d8', borderTopColor: '#21212180', borderTopWidth: 3 }}
      labelStyle={{color: '#FAF0E6'}}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  )
}

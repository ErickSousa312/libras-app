import React, { useEffect, useReducer, useState } from 'react';
import {
  StyleSheet,
  RefreshControl,
  View,
  Pressable,
  TextInput,
} from 'react-native';
import MonthYear from '@/components/formSearch/monthAndYear';
import { ScrollView } from 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Text } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { searchAxiosGet } from '@/components/axios/searchAxiosGet';
import { TypeLibrasData, TypeLibrasDataSinais } from '@/@types/LibrasData';
import { NoResultsComponent } from '@/components/formSearch/erroSearch';
import { Image } from 'expo-image';
import { DataLibrasReducer } from '@/utils/reducer/DataLibrasReducer';
import { initialStateDataLibrasReducer } from '../../utils/reducer/DataLibrasReducer';

function App() {
  const [data, setData] = useState<TypeLibrasData[]>();
  const [editable, setEditable] = useState<boolean>(false);
  const [updatedData, dispatchUpdateData] = useReducer(
    DataLibrasReducer,
    initialStateDataLibrasReducer,
  );
  const [refreshing, setRefreshing] = useState(true);
  const { slug } = useLocalSearchParams();
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  async function searchData() {
    const response = await searchAxiosGet();
    if (response.data) {
      response.data.map((item: TypeLibrasData) => {
        dispatchUpdateData({
          type: 'added',
          payload: item,
        });
      });
      setData(response.data);
    }
  }

  useEffect(() => {
    searchData();
    console.log(data);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={false} progressViewOffset={70} />
      }
    >
      <MonthYear></MonthYear>
      <Text
        style={{
          marginTop: 10,
          alignSelf: 'center',
          textAlign: 'center',
          fontSize: 18,
          width: '95%',
        }}
      >
        {`Confira alguns significados para a palavra "${slug}" e seus respectivos sinais`}
      </Text>
      <Pressable
        style={{
          width: '100%',
        }}
        onPress={() => {
          setEditable(!editable);
          console.log(updatedData);
        }}
      >
        {/* teste para input */}

        <Text
          style={{
            marginTop: 15,
            alignSelf: 'flex-end',
            backgroundColor: '#e7503b',
            borderRadius: 15,
            paddingVertical: 5,
            paddingHorizontal: 8,
            marginRight: 5,
          }}
        >
          {' '}
          Editar
        </Text>
      </Pressable>
      {updatedData &&
        updatedData.map((item, index) => (
          <TextInput
            editable={editable}
            key={index}
            style={editable ? styles.input : styles.inputDisabled}
            value={item.nameWord}
            onChangeText={(text) => {
              console.log(text);
              const wordDefinition = item.wordDefinitions.map((item) => item);
              dispatchUpdateData({
                type: 'changed',
                payload: {
                  id: item.id,
                  nameWord: text,
                  wordDefinitions: item.wordDefinitions,
                },
              });
            }}
          ></TextInput>
        ))}
      {updatedData &&
        updatedData.map((item: TypeLibrasData, index: number) => (
          <View key={`inner_${index}`}>
            {data &&
              item.wordDefinitions.map(
                (item: TypeLibrasDataSinais, innerindex: number) => (
                  <View key={`outer_${index}${innerindex}`}>
                    <Image
                      style={styles.image}
                      source={item.src}
                      contentFit="cover"
                      placeholder={{ blurhash }}
                      transition={1000}
                    />
                    <Text
                      style={{
                        marginTop: 10,
                        alignSelf: 'center',
                        textAlign: 'center',
                        fontSize: 20,
                        width: '75%',
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                      }}
                    >
                      {`Categoria: ${
                        item.category.nameCategory !== null
                          ? item.category.nameCategory
                          : 'oi'
                      }`}
                    </Text>

                    <Text
                      style={{
                        marginTop: 10,
                        alignSelf: 'center',
                        textAlign: 'center',
                        fontSize: 20,
                        width: '75%',
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.descriptionWordDefinition !== null
                        ? item.descriptionWordDefinition
                        : 'oi'}
                    </Text>
                  </View>
                ),
              )}
          </View>
        ))}
      {!data && <NoResultsComponent slug={slug}></NoResultsComponent>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F2DA',
    width: 'auto',
    paddingVertical: 0,
  },
  image: {
    width: 290,
    height: 280,
    marginTop: 18,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
    borderRadius: 15,
  },
  input: {
    marginTop: 14,
    width: '75%',
    alignSelf: 'center',
    textAlign: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e7503b',
    color: 'Red',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 20,
  },
  inputDisabled: {
    marginTop: 22,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    width: '75%',
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'red',
  },
});

export default gestureHandlerRootHOC(App);

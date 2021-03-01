import React, {useState, useCallback, useEffect} from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Modal, TextInput, AsyncStorage} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import TaskList from './src/component/TaskList/TaskList';
import * as Animatable from 'react-native-animatable' 

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity)


export default function App () {

  const [task, setTask] = useState([ ])
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('')


  useEffect (() => {
    async function loadTasks() {
      const taskStorage = await AsyncStorage.getItem('@tasks');
      if(taskStorage) {
        setTask(JSON.parse(taskStorage))
      }
    }

    loadTasks()
  }, [])

  useEffect (() => {
    async function saveTask() {
      await AsyncStorage.setItem('@tasks', JSON.stringify(task))
    }
    saveTask()
  }, [task])


  function handleAddTask () {
    if( input === '') return;

    const data = {
      key: input,
      task: input
    };

    setTask([ ...task, data])
    setOpen(false);
    setInput('')
  }

const handleDelete = useCallback((data) => {
  const find = task.filter( r => r.key !== data.key)
  setTask(find)
})

  return (
    <SafeAreaView style={styles.container} >
      <StatusBar backgroundColor="#171d31"/>
      <View style={styles.content}>
      <Text style={styles.title}>Minhas tarefas</Text>
      </View>
      
    <FlatList
    marginHorozintal={10}
    showsHorizontalScrollIndicator={false}
    data={task}
    keyExtractor={(item) => String(item.key)}
    renderItem={({item}) => <TaskList data={item} handleDelete={handleDelete}/>}
    />

      <AnimatedBtn
      style={styles.button}
      animation="bounceInUp"
      duration={1500}
      useNativeDriver
      onPress={() => setOpen(true)}>
    <Ionicons name="ios-add" size={35} color="#fff"/>
      </AnimatedBtn>

      <Modal animationType="slide" transparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>

          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setOpen(false)}>
            <Ionicons style={{marginLeft: 5, marginRight: 5}} name="md-arrow-back" size={40} color="#fff"/>
            </TouchableOpacity>
            <Text style={styles.titleModal}>Nova Tafera</Text>
          </View>

          <Animatable.View
          stule={styles.modalBody}
          animation="fadeInUp"
          useNativeDriver
          >
            
          <TextInput 
          multiline={true}
          autoCorrect={false}
          placeholder="O que deseja fazer hoje?"
          style={styles.input}
          value={input}
          onChangeText={(text) => setInput(text)}
          />

          <TouchableOpacity style={styles.handleAdd} onPress={handleAddTask}>
            <Text style={styles.handleAddText}>Cadastrar Tarefa</Text>
          </TouchableOpacity>
          </Animatable.View>

        </SafeAreaView>
      </Modal>
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171d31'
  },
  content: {

  },
  title: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 25,
    textAlign: 'center',
    color: '#fff'
  },
  titleModal: {
    marginTop: 10,
    marginLeft: 25,
    marginBottom: 10,
    fontSize: 25,
    textAlign: 'center',
    color: '#fff'
  },
  button: {
    position: 'absolute',
    backgroundColor: '#00BFFF',
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3
    }
  },
  modal: {
    flex: 1,
    backgroundColor: '#171d31'
  },
  modalHeader: {
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalBody: {
    marginTop: 15
  },
  input: {
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 9,
    height: 300,
    textAlignVertical: 'top',
    color: '#171d31',
    borderRadius: 8
  },
  handleAdd: {
    backgroundColor: "#fff",
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 8
  }, 
  handleAddText: {
    fontSize: 18,
    color:'#171d31'
  }
})


import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {database} from './data/database';

const App = () => {
  const [showCard, setShowCard] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [notes, setNotes] = useState([]);
  const [type, setType] = useState('new');
  const [selectedId,setSelectedId]=useState('')

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    const notesData = database.collections.get('notes');
    console.log(notesData);
    notesData
      .query()
      .observe()
      .forEach(item => {
        console.log('item===>', item);
        let temp = [];
        item.forEach(data => {
          temp.push(data._raw);
        });
        setNotes(temp);
      });
  };
  const addNote = async () => {
    await database.write(async () => {
      const newPost = await database.get('notes').create(note => {
        note.note = title;
        note.desc = desc;
      });
      console.log('saved');
      setTitle('');
      setDesc('');
      setShowCard(false);

      getNotes();
    });
  };

  const updateNote = async() => {
    await database.write(async () => {
      const note = await database.get('notes').find(selectedId)
      await note.update((item) => {
        item.note = title
        item.desc=desc
      })
      setType('new')
      setTitle('')
      setDesc('')
      setShowCard(false)
      getNotes()
    })
  };

  const deleteNote = async id => {
    await database.write(async () => {
      const note = await database.get('notes').find(id);
      await note.destroyPermanently();
      getNotes();
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      {showCard && (
        <View
          style={{
            width: '90%',
            paddingBottom: 20,
            backgroundColor: 'white',
            shadowColor: 'rgba(0,0,0,.5)',
            shadowOpacity: 0.5,
            alignSelf: 'center',
            padding: 10,
            marginTop: 20,
            borderRadius: 8,
          }}>
          <Text style={{alignSelf: 'center', marginTop: 10, fontSize: 18}}>
            {type == 'new' ? ' Add Note' : ' Update Note'}
          </Text>
          <TextInput
            placeholder="Enter Note Title"
            style={{
              width: '90%',
              height: 50,
              borderWidth: 0.5,
              alignSelf: 'center',
              marginTop: 20,
              paddingLeft: 20,
            }}
            value={title}
            onChangeText={txt => setTitle(txt)}
          />
          <TextInput
            placeholder="Enter Note Desc"
            style={{
              width: '90%',
              height: 50,
              borderWidth: 0.5,
              alignSelf: 'center',
              marginTop: 20,
              paddingLeft: 20,
            }}
            value={desc}
            onChangeText={txt => setDesc(txt)}
          />
          <TouchableOpacity
            style={{
              width: '90%',
              marginTop: 20,
              height: 50,
              borderRadius: 8,
              backgroundColor: 'purple',

              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              if(type=='new'){
                addNote();
              }else{
                updateNote()
              }
              
            }}>
            <Text style={{color: 'white', fontSize: 18}}>
              {type == 'edit' ? 'Save Note' : 'Add New Note'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '90%',
              marginTop: 20,
              height: 50,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'purple',

              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowCard(false);
            }}>
            <Text style={{color: 'purple', fontSize: 18}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={notes}
        renderItem={({item, index}) => {
          console.log(item);
          return (
            <View
              style={{
                width: '90%',
                height: 80,
                alignSelf: 'center',
                borderWidth: 0.5,

                paddingLeft: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: 10,
              }}>
              <View>
                <Text style={{fontSize: 18}}>{item.note}</Text>
                <Text>{item.desc}</Text>
              </View>
              <View>
                <Text
                  style={{color: 'red'}}
                  onPress={() => {
                    deleteNote(item.id);
                  }}>
                  DELETE
                </Text>
                <Text
                  style={{color: 'blue', marginTop: 10}}
                  onPress={() => {
                    setType('edit');
                    setTitle(item.note);
                    setDesc(item.desc);
                    setSelectedId(item.id)
                    setShowCard(true);
                  }}>
                  EDIT
                </Text>
              </View>
            </View>
          );
        }}
      />
      <TouchableOpacity
        style={{
          width: '100%',
          bottom: 30,
          height: 60,
          backgroundColor: 'purple',
          position: 'absolute',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          setShowCard(true);
        }}>
        <Text style={{color: 'white', fontSize: 18}}>Add New Note</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;

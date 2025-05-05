import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    FlatList,
    ListRenderItem,
    StyleSheet
} from 'react-native';
import { database } from './data/database';
import { _RawRecord } from '@nozbe/watermelondb/RawRecord';

// Define the type for a note record
type Note = {
    id: string;
    note: string;
    desc: string;
};

const App = () => {
    const [showCard, setShowCard] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [desc, setDesc] = useState<string>('');
    const [notes, setNotes] = useState<Note[]>([]);
    const [type, setType] = useState<'new' | 'edit'>('new');
    const [selectedId, setSelectedId] = useState<string>('');

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        const notesData = database.collections.get('notes');
        notesData
            .query()
            .observe()
            .forEach((items) => {
                const temp: Note[] = [];
                items.forEach(data => {
                    temp.push(data._raw as unknown as Note);
                });
                setNotes(temp);
            });
    };

    const addNote = async () => {
        await database.write(async () => {
            await database.get('notes').create((note: any) => {
                note.note = title;
                note.desc = desc;
            });
            setTitle('');
            setDesc('');
            setShowCard(false);
            getNotes();
        });
    };

    const updateNote = async () => {
        await database.write(async () => {
            const note = await database.get('notes').find(selectedId);
            await note.update((item: any) => {
                item.note = title;
                item.desc = desc;
            });
            setType('new');
            setTitle('');
            setDesc('');
            setShowCard(false);
            getNotes();
        });
    };

    const deleteNote = async (id: string) => {
        await database.write(async () => {
            const note = await database.get('notes').find(id);
            await note.destroyPermanently();
            getNotes();
        });
    };

    const renderItem: ListRenderItem<Note> = ({ item }) => {
        return (
            <View style={styles.noteCard}>
                <View>
                    <Text style={styles.noteTitle}>{item.note}</Text>
                    <Text>{item.desc}</Text>
                </View>
                <View>
                    <Text
                        style={styles.deleteText}
                        onPress={() => deleteNote(item.id)}
                    >
                        DELETE
                    </Text>
                    <Text
                        style={styles.editText}
                        onPress={() => {
                            setType('edit');
                            setTitle(item.note);
                            setDesc(item.desc);
                            setSelectedId(item.id);
                            setShowCard(true);
                        }}
                    >
                        EDIT
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {showCard && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        {type === 'new' ? 'Add Note' : 'Update Note'}
                    </Text>
                    <TextInput
                        placeholder="Enter Note Title"
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        placeholder="Enter Note Desc"
                        style={styles.input}
                        value={desc}
                        onChangeText={setDesc}
                    />
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => {
                            if (type === 'new') {
                                addNote();
                            } else {
                                updateNote();
                            }
                        }}
                    >
                        <Text style={styles.primaryButtonText}>
                            {type === 'edit' ? 'Save Note' : 'Add New Note'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => setShowCard(false)}
                    >
                        <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setShowCard(true)}
            >
                <Text style={styles.floatingButtonText}>Add New Note</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '90%',
        paddingBottom: 20,
        backgroundColor: 'white',
        shadowColor: 'rgba(0,0,0,.5)',
        shadowOpacity: 0.5,
        alignSelf: 'center',
        padding: 10,
        marginTop: 20,
        borderRadius: 8,
    },
    cardTitle: {
        alignSelf: 'center',
        marginTop: 10,
        fontSize: 18,
    },
    input: {
        width: '90%',
        height: 50,
        borderWidth: 0.5,
        alignSelf: 'center',
        marginTop: 20,
        paddingLeft: 20,
    },
    primaryButton: {
        width: '90%',
        marginTop: 20,
        height: 50,
        borderRadius: 8,
        backgroundColor: 'purple',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 18,
    },
    secondaryButton: {
        width: '90%',
        marginTop: 20,
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'purple',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: 'purple',
        fontSize: 18,
    },
    noteCard: {
        width: '90%',
        height: 80,
        alignSelf: 'center',
        borderWidth: 0.5,
        paddingLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
    },
    noteTitle: {
        fontSize: 18,
    },
    deleteText: {
        color: 'red',
    },
    editText: {
        color: 'blue',
        marginTop: 10,
    },
    floatingButton: {
        width: '100%',
        bottom: 30,
        height: 60,
        backgroundColor: 'purple',
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingButtonText: {
        color: 'white',
        fontSize: 18,
    },
});


export default App;
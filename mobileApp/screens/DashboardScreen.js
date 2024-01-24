import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { fetchAttendanceRecords } from '../services/apiService';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput as PaperTextInput, Button, Portal, Dialog } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ActivityIndicator } from 'react-native';
const ITEMS_PER_PAGE = 10;
const CustomPagination = ({ totalPage, currentPage, onPageChange }) => {
    const pages = Array.from({ length: totalPage }, (_, index) => index + 1);

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            {pages.map((page) => (
                <TouchableOpacity
                    key={page}
                    style={{
                        padding: 10,
                        margin: 5,
                        backgroundColor: currentPage === page ? '#3498db' : '#ddd',
                        borderRadius: 5,
                    }}
                    onPress={() => onPageChange(page)}
                >
                    <Text style={{ color: currentPage === page ? 'white' : 'black' }}>{page}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const DashboardScreen = () => {
    const [originalAttendanceRecords, setOriginalAttendanceRecords] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [searchDate, setSearchDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(attendanceRecords.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const paginatedRecords = attendanceRecords.slice(startIndex, endIndex);
    const fetchRecords = async () => {
        try {
            setIsLoading(true);
            const token = await AsyncStorage.getItem('token');
            const response = await fetchAttendanceRecords(token);
            setOriginalAttendanceRecords(response.data);    
            setAttendanceRecords(response.data);

        } catch (error) {
            console.error('Error fetching attendance records:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const searchRecords = () => {
        const formattedSearchDate = new Date(searchDate).toLocaleDateString();
        const filtered = originalAttendanceRecords.filter(
            (record) => new Date(record.date).toLocaleDateString() === formattedSearchDate
        );
        setAttendanceRecords(filtered);
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleDateChange = (event, date) => {
        if (date) {
            setSearchDate(new Date(date));
        }
        setDatePickerVisible(false);
    };


    useEffect(() => {
        fetchRecords();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <PaperTextInput
                    style={styles.input}
                    label="Select Date"
                    value={new Date(searchDate).toLocaleDateString()}
                    onTouchStart={showDatePicker}
                />
                <Button
                    mode="contained"
                    style={styles.submitButton}
                    onPress={searchRecords}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>Search</Text>
                    )}
                </Button>

                <Portal>
                    <Dialog visible={isDatePickerVisible} onDismiss={() => setDatePickerVisible(false)}>
                        <Dialog.Title>Select Date</Dialog.Title>
                        <Dialog.Content>
                            <DateTimePicker
                                value={searchDate}
                                mode="date"
                                display="spinner"
                                onChange={handleDateChange}
                            />
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </View>
            <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                    <Text style={styles.columnHeader}>Date</Text>
                    <Text style={styles.columnHeader}>In Time</Text>
                    <Text style={styles.columnHeader}>Out Time</Text>
                    <Text style={styles.columnHeader}>Status</Text>
                </View>

                <FlatList
                    data={paginatedRecords}
                    keyExtractor={(item) => item._id}
                    ListEmptyComponent={() => (
                        <View style={styles.noRecordsContainer}>
                            <Text style={styles.noRecordsText}>No records found</Text>
                        </View>
                    )}
                    renderItem={({ item, index }) => (
                        <View style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                            <Text style={styles.tableCell}>{new Date(item.date).toLocaleDateString()}</Text>
                            <Text style={styles.tableCell}>{item.inTime}</Text>
                            <Text style={styles.tableCell}>{item.outTime}</Text>
                            <Text
                                style={[styles.tableCell, item.status ? styles.presentText : styles.absentText]}
                            >
                                {item.status ? 'Present' : 'Absent'}
                            </Text>
                        </View>
                    )}
                />
                <CustomPagination
                    totalPage={totalPages}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
    },
    formContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    input: {
        flex: 2,
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: "white"
    },
    submitButton: {
        flex: 1,
        borderRadius: 5,
        height: 56,
        justifyContent: 'center',
        backgroundColor: '#3498db',
    },
    formContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    summaryContainer: {
        marginBottom: 20,
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#3498db',
        borderRadius: 5,
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#3498db',
        padding: 10,
        backgroundColor: '#3498db',
    },
    columnHeader: {
        flex: 1,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    tableRowEven: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    tableRowOdd: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        padding: 10,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
    },
    presentText: {
        color: 'green',
    },
    absentText: {
        color: 'red',
    },
    noRecordsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noRecordsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
    },
    pagination: {
        marginVertical: 10,
    },
});
export default DashboardScreen;
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { PieChart } from "react-native-chart-kit";
import { Overlay } from 'react-native-elements';

class Home extends React.Component {
    static navigationOptions = {
        title: '湯姆熊會員查詢',
        headerStyle: {
            backgroundColor: 'white',
        },
        headerTintColor: '#287BC1',
        headerStyle: {
            borderBottomWidth: 0,
            shadowColor: 'transparent'
        },
        shadowColor: 'transparent',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    state = {
        name: '',
        show_a: false,
        show_b: false,
        area: null, //區域資料
        c_area: '',  //選到的區域
        area_txt: '請選擇區域',
        store: null,
        c_store: '',
        store_txt: '請選擇店',
        pie_data: null,

    };

    componentDidMount() {
        global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
        global.FormData = global.originalFormData || global.FormData;

        if (window.FETCH_SUPPORT) {
            window.FETCH_SUPPORT.blob = false;
        } else {
            global.Blob = global.originalBlob || global.Blob;
            global.FileReader = global.originalFileReader || global.FileReader;
        }
        this.getA();
    }


    getA() {
        let postdata = new FormData();
        postdata.append('type', 'A');

        fetch('*', {
            method: 'POST',
            body: postdata,
        }).then((result => {
            if (result.ok) {
                result.json().then((obj) => {
                    console.log(obj);
                    if (obj.success) {
                        this.setState({
                            area: obj.data,

                        })
                    }
                })
            }
        })).catch((error) => {
            console.log('error', error);
            Alert.alert('錯誤', '錯誤代碼 Signup-1');
        })
    }

    getC() {
        let postdata = new FormData();
        postdata.append('type', 'C');
        postdata.append('dp1lun2', this.state.c_area.lu1no);
        console.log('lu1no', this.state.c_area.lu1no);
        //console.log('postdata', postdata);

        fetch('*', { //?type=C&dp1lun2=' + this.state.c_area.lu1no
            method: 'POST',
            body: postdata,
        }).then((result => {
            console.log(result);
            if (result.ok) {
                result.json().then((obj) => {
                    console.log(obj);
                    if (obj.success) {
                        this.setState({
                            store: obj.data,
                            show_b: true,
                        })
                    }
                })
            }
        })).catch((error) => {
            Alert.alert('錯誤', '錯誤代碼 Signup-1');
        })
    }

    getM() {
        if (this.state.c_area == '' || this.state.c_store == '') {
            Alert.alert('注意', '請先選區域和店家！');
            return;
        }
        let postdata = new FormData();
        postdata.append('type', 'M');
        postdata.append('brano', this.state.c_store.DP1NO);
        console.log('postdata', postdata);
        fetch('*', {//?type=M&brano=' + this.state.c_store.DP1NO,
            method: 'POST',
            body: postdata,
        }).then((result => {
            if (result.ok) {
                result.json().then((obj) => {
                    console.log(obj);
                    if (obj.success) {
                        console.log(obj.data[0].n1);
                        let data = [
                            {
                                name: "<18",
                                population: obj.data[0].n1,
                                color: "rgb(184,218,230)",
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 15
                            },
                            {
                                name: "18~20",
                                population: obj.data[0].n2,
                                color: "#ECB2B7",
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 15
                            },
                            {
                                name: "21~25",
                                population: obj.data[0].n3,
                                color: "#E9DB7E",
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 15
                            },
                            {
                                name: "25~30",
                                population: obj.data[0].n4,
                                color: "#9ADDAD",
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 15
                            },
                            {
                                name: ">30",
                                population: obj.data[0].n5,
                                color: "#BEAEDB",
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 15
                            }
                        ];
                        this.setState({
                            pie_data: data
                        })
                    }
                })
            }
        })).catch((error) => {
            Alert.alert('錯誤', '錯誤代碼 Signup-1');
        })
    }

    Cbtn() {
        if (this.state.c_area == '') {
            Alert.alert('注意', '請先選區域！');
            return;
        }
        this.getC();
    }



    areaChange(index) {
        console.log(this.state.area[index]);
        //this.getC(this.state.area[index]);
        this.setState({
            area_txt: this.state.area[index].lu1name,
            c_area: this.state.area[index],
            show_a: false,
        })
    }

    storeChange(index) {
        this.setState({
            store_txt: this.state.store[index].DP1NAME,
            c_store: this.state.store[index],
            show_b: false,
        })
    }

    onChangeText = name => this.setState({ name });

    render() {


        let chartConfig = {
            backgroundGradientFrom: "#1E2923",  //定義圖表背景的線性漸變中的第一種顏色
            backgroundGradientFromOpacity: 0,   //定義圖表背景的線性漸變中的第一個顏色不透明度
            backgroundGradientTo: "#08130D",    //定義圖表背景的線性漸變中的第二種顏色
            backgroundGradientToOpacity: 0.5,   //定義圖表背景的線性漸變中的第二種顏色不透明度
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,   //定義用於計算圖表中使用的標籤和扇區顏色的基礎顏色功能
            strokeWidth: 2, // optional, default 3  //在圖表中定義基本筆劃寬度
            barPercentage: 0.5  //定義圖表中每個條形寬度的可用寬度的百分比（0-1）
        };



        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ height: 15, margin: 16 }} />
                <View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity style={{ width: '80%', height: 40, padding: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F2F6' }}
                            onPress={() => {

                                this.setState({
                                    show_a: true,
                                    c_area: '',  //選到的區域
                                    area_txt: '請選擇區域',
                                    store: null,
                                    c_store: '',
                                    store_txt: '請選擇店',
                                    pie_data: null,
                                })
                            }}>
                            <Text style={{ fontSize: 16, textAlign: 'center', color: '#438EC6' }}>{this.state.area_txt}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginTop: 32 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity style={{ width: '80%', height: 40, padding: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F2F6' }}
                            onPress={this.Cbtn.bind(this)}>
                            <Text style={{ fontSize: 16, textAlign: 'center', color: '#438EC6' }}>{this.state.store_txt.trim()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity style={{ width: '80%', height: 40, backgroundColor: '#287BC1', padding: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                        onPress={this.getM.bind(this)}>
                        <Text style={{ fontSize: 20, textAlign: 'center', color: 'white' }}>查詢</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 60 }}>
                    {
                        this.state.pie_data != null &&
                        <PieChart
                            data={this.state.pie_data}
                            width={400}
                            height={220}
                            chartConfig={chartConfig}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                        //absolute  //實質數字
                        />
                    }
                </View>
                {
                    this.state.show_a && (
                        <Overlay
                            isVisible={this.state.show_a}
                            width={'80%'}
                            height={300}
                            onBackdropPress={() => this.setState({ show_a: false })}
                            //containerStyle={{ marginTop: 64 }}
                            overlayStyle={{ margin: 0, padding: 0, marginTop: 82, marginBottom: 18 }}>
                            <ScrollView>
                                {
                                    this.state.area != null && this.state.area.map((result, index, array) => {
                                        return <TouchableOpacity key={index} style={{ height: 45, borderBottomColor: '#E4E3FA', borderBottomWidth: 0.5, flexDirection: 'row', marginLeft: 16, marginRight: 16, alignItems: 'center', justifyContent: 'center' }} onPress={this.areaChange.bind(this, index)}>
                                            <Text style={{ fontSize: 14, padding: 8, textAlign: 'center', color: '#4489F7' }}>
                                                {result.lu1name.trim()}
                                            </Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </ScrollView>
                        </Overlay>
                    )
                }
                {
                    this.state.show_b && (
                        <Overlay
                            isVisible={this.state.show_b}
                            width={'80%'}
                            height={300}
                            onBackdropPress={() => this.setState({ show_b: false })}
                            //containerStyle={{ marginTop: 64 }}
                            overlayStyle={{ margin: 0, padding: 0, marginTop: 82, marginBottom: 18 }}>
                            <ScrollView>
                                {
                                    this.state.store != null && this.state.store.map((result, index, array) => {
                                        return <TouchableOpacity key={index} style={{ height: 45, borderBottomColor: '#E4E3FA', borderBottomWidth: 0.5, flexDirection: 'row', marginLeft: 16, marginRight: 16, alignItems: 'center', justifyContent: 'center' }} onPress={this.storeChange.bind(this, index)}>
                                            <Text style={{ fontSize: 14, padding: 8, textAlign: 'center', color: '#4489F7' }}>
                                                {result.DP1NAME.trim()}
                                            </Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </ScrollView>
                        </Overlay>
                    )
                }
            </View>
        )
    }
}



const styles = StyleSheet.create({
    title: {
        fontSize: 20,
    },
    nameInput: {
        marginTop: 16,
        borderColor: 'black',
        borderWidth: 1,
        padding: 8,
        width: 200
    },
    buttonnText: {
        marginTop: 16,
        fontSize: 24,

    },
});

export default Home;

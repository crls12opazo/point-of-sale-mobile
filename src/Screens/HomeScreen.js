import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    View,
    FlatList,
    StyleSheet,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    Animated,
    RefreshControl,
    StatusBar
} from 'react-native'
import {
    Button,
    Text,
    TopNavigation,
    TopNavigationAction,
    Icon
} from 'react-native-ui-kitten'
import Drawer from 'react-native-drawer'
import Wave from 'react-native-waveview'
import AsyncStorage from '@react-native-community/async-storage'
import Http from '../Helper/Http'
import DrawerContent from '../Components/DrawerContent'
import CardProduct from '../Components/Cards/CardProduct'
import CategoryList from '../Components/Lists/CategoryList'
import FabButton from '../Components/FabButton'

const SCREEN_WIDTH = Dimensions.get('window').width

class HomeScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            headY: new Animated.Value(0),
            products: [],
            categories: [
                {
                    id: 1,
                    name: 'Laptop',
                    icon: 'laptop'
                },
                {
                    id: 2,
                    name: 'Smartphone',
                    icon: 'smartphone'
                },
                {
                    id: 3,
                    name: 'Smartphone',
                    icon: 'smartphone'
                },
                {
                    id: 4,
                    name: 'Smartphone',
                    icon: 'smartphone'
                },
                {
                    id: 5,
                    name: 'Smartphone',
                    icon: 'smartphone'
                }
            ],
            isLoading: false
        }
    }

    componentDidMount(){
        this.checkAuth()
        this.getProductData()
    }

    async getProductData(){
        this.setState({
            isLoading: true
        })
        await Http.get('/product?sort=created_at&mode=desc&limit=4')
        .then((res) => {
            this.setState({
                products: res.data.data.results,
                isLoading: false
            })
        })
        .catch((err) => {
            this.setState({
                isLoading: false
            })
            console.log(err.message)
        })
    }

    async checkAuth(){
        await Http.get('/user')
        .then((res) => {
            if(res.data.status == 403){
                this.props.navigation.replace('Login')
            }
        })
        .catch((err) => {
            console.log(err.message)
        })
    }

    closeControlPanel = () => {
        this._drawer.close()
    };

    openControlPanel = () => {
        this._drawer.open()
    };

    MenuIcon(style){
        return(
            <Icon {...style} name='menu-2-outline' fill='#f5365c' />
        )
    }

    MenuDrawerAction(){
        return(
            <TopNavigationAction icon={this.MenuIcon} onPress={() => this.openControlPanel()} />
        )
    }

    render(){
        
        var headMov = this.state.headY.interpolate({
            inputRange: [0, 300, 300],
            outputRange: [0, -185, -185]
        });
          
        return(
            <>
                <StatusBar barStyle="light-content" backgroundColor="#f53b60" />
                <Drawer
                    ref={(ref) => this._drawer = ref}
                    openDrawerOffset={100}
                    tapToClose={true}
                    content={<DrawerContent navigation={this.props.navigation} />}
                >
                    <View style={styles.container}> 
                        <TopNavigation
                            title='POINTZO'
                            alignment='center'
                            style={styles.topNav}
                            titleStyle={styles.titleTopNav}
                            leftControl={this.MenuDrawerAction()}
                        />
                        <Animated.View style={{transform: [{ translateY: headMov }]}}>
                            <ImageBackground source={require('../Assets/Images/bg-home.png')} style={styles.header}>
                                <View style={styles.waveView}>
                                    <Wave
                                        style={styles.wave}
                                        H={25}
                                        waveParams={[
                                            {A: 30, T: SCREEN_WIDTH, fill: 'rgba(255, 255, 255, 0.2)'},
                                            {A: 35, T: SCREEN_WIDTH, fill: 'rgba(255, 255, 255, 0.4)'},
                                            {A: 17, T: SCREEN_WIDTH, fill: 'rgba(255, 255, 255, 1)'},
                                        ]}
                                        animated={true}
                                    />
                                </View>
                            </ImageBackground>
                            
                            <Animated.ScrollView 
                                style={{backgroundColor: '#fff', zIndex: 2, marginBottom: 150}}
                                scrollEventThrottle={16}
                                onScroll={
                                    Animated.event(
                                    [
                                        {
                                            nativeEvent: { contentOffset: { y: this.state.headY } }
                                        }
                                    ],
                                    {
                                        useNativeDriver: true
                                    }
                                )}
                                refreshControl={
                                    <RefreshControl refreshing={false} onRefresh={() => this.getProductData()} />
                                }
                            >

                                <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
                                    <Text category='h5' style={styles.headerTitle}>By Category</Text>
                                </View>

                                <CategoryList category={this.state.categories} />

                                <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 40 }}>
                                    <Text category='h5' style={[styles.headerTitle, styles.borderedText]}>Browse Product</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Product')} style={{ marginLeft: 'auto', marginTop: 6 }}>
                                        <Text style={{ color: '#f5365c' }}>Show more</Text>
                                    </TouchableOpacity>
                                </View>

                                <CardProduct product={this.state.products} />
                            </Animated.ScrollView>
                        </Animated.View>
                    </View>

                    <FabButton navigate={this.props.navigation.navigate} />

                </Drawer>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    header:{
        paddingVertical: 14,
        height: 120,
        backgroundColor: 'blue',
        position: 'relative',
        transform: [
            {translateY: -68}
        ],
        zIndex: 2,
    },
    topNav: {
        borderRadius: 6,
        marginTop: 12,
        shadowColor: "#000",
        marginHorizontal: 12,
        elevation: 14,
        zIndex: 2
    },
    titleTopNav: {
        fontFamily: 'Montserrat-Bold'
    },
    headerTitle:{
        color: '#4a4a4a',
        fontFamily: 'Montserrat-Bold',
        marginBottom: 20
    },
    borderedText: {
        borderBottomColor: '#f5365c',
        borderBottomWidth: 3
    },
    waveView: {
        width: SCREEN_WIDTH,
        alignItems: 'center'
    },
    wave: {
        width: SCREEN_WIDTH,
        height: 120,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    body:{
        flex: 1
    }
})

const mapStateToProps = state => {
    return {
        Auth: state.Auth
    }
}

export default connect(mapStateToProps)(HomeScreen)
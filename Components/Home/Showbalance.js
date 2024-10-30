import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  Linking,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import {getAuth} from 'firebase/auth';
import {collection, onSnapshot, query, where} from 'firebase/firestore';
import {app, db} from '../../Firebase';
// import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-reanimated-carousel';

const Showbalance = ({navigation}) => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const data2 = [
    {
      label: 'Heart Pain',
      label1: 'Cardiologist',
      image: 'https://cdn-icons-png.flaticon.com/512/1546/1546124.png',
    },
    {
      label: 'Face Acne',
      label1: 'Dermatologist',
      image:
        'https://static.vecteezy.com/system/resources/previews/019/761/802/non_2x/beauty-parlour-skincare-salon-spa-dermatology-clinic-logo-design-design-concept-free-vector.jpg',
    },
    {
      label: 'Headache',
      label1: 'Neurologist',
      image:
        'https://c8.alamy.com/comp/2BKGHAK/brain-neurology-logo-2BKGHAK.jpg',
    },
    {
      label: 'Joint Pain',
      label1: 'Orthopedic',
      image:
        'https://static.vecteezy.com/system/resources/previews/017/438/838/non_2x/joint-bones-logo-design-for-orthopedic-clinics-free-vector.jpg',
    },

    {
      label: 'Baby Doctor',
      label1: 'Pediatrician',
      image:
        'https://img.freepik.com/premium-vector/pediatrician-logo-template-design-vector_20029-1040.jpg',
    },
    {
      label: 'Feel Depressed',
      label1: 'Psychiatrist',
      image:
        'https://cdn.vectorstock.com/i/500p/20/78/human-head-logo-psychological-vector-46552078.jpg',
    },
    {
      label: 'UltraSound',
      label1: 'Radiologist',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7PfK0wtBEPywVa4Unlx6Ilb7r2_9qZoVhiA&s',
    },
    {
      label: 'Bones Pain',
      label1: 'Orthopedic',
      image:
        'https://static.vecteezy.com/system/resources/previews/017/438/838/non_2x/joint-bones-logo-design-for-orthopedic-clinics-free-vector.jpg',
    },
    {
      label: 'Urine Issue',
      label1: 'Urologist',
      image:
        'https://cdn.vectorstock.com/i/500p/43/52/urology-logo-vector-46474352.jpg',
    },
    {
      label: 'Gynecologist',
      label1: 'Gynecologist',
      image:
        'https://w7.pngwing.com/pngs/621/257/png-transparent-obstetrics-and-gynaecology-obstetrics-and-gynaecology-clinic-hospital-obstetrics-s-purple-blue-text-thumbnail.png',
    },
    {
      label: 'Allergy',
      label1: 'General',
      image:
        'https://static.vecteezy.com/system/resources/thumbnails/021/599/743/small/the-logo-for-a-science-laboratory-is-called-a-microscope-vector.jpg',
    },
    {
      label: 'Fever',
      label1: 'General',
      image:
        'https://w7.pngwing.com/pngs/206/469/png-transparent-health-care-physician-surgery-surgeon-medicine-general-practitioner.png',
    },
    {
      label: 'Migrane Issue',
      label1: 'Neurologist',
      image:
        'https://cdn.vectorstock.com/i/500p/20/78/human-head-logo-psychological-vector-46552078.jpg',
    },
  ];

  const auth = getAuth(app);
  const [GetData, setGetData] = useState([]);
  const [GetData1, setGetData1] = useState([]);
  const [GetData2, setGetData2] = useState([]);
  const [userflag, setuserflag] = useState(true);
  const date = new Date().toDateString();
  const [GetData3, setGetData3] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('role').then(role => {
      setuserflag(role);
    });
  }, []);

  useEffect(() => {
    const coll = collection(db, 'Companypromotion');

    const unSubscribe = onSnapshot(coll, snapshot => {
    //   setGetData3(
    //     snapshot.docs.map(doc => ({
    //       selecteduser: doc.data(),
    //     })),
    //   );

    const data = snapshot.docs.map(doc => ({
        selecteduser: doc.data(),
      }));
      console.log('Fetched Data:', data); // Debug log for data
      setGetData3(data);

    });

    return () => {
      unSubscribe();
    };
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    const coll = collection(db, 'Company');

    const unSubscribe = onSnapshot(coll, snapshot => {
      setGetData(
        snapshot.docs.map(doc => ({
          selecteduser: doc.data(),
        })),
      );

  
    });
    return () => {
      unSubscribe();
    };
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    const coll = collection(db, 'Companysymptoms');

    const unSubscribe = onSnapshot(coll, snapshot => {
        setGetData2(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
     
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const [images, setImages] = useState([
    'https://img.freepik.com/free-vector/hospital-healthcare-service-facebook-template_23-2150395866.jpg',
    'https://img.freepik.com/free-vector/hospital-healthcare-service-sale-banner_23-2150394136.jpg',
    'https://img.freepik.com/premium-vector/health-care-social-media-post-template_544391-490.jpg?semt=ais_hybrid',
  ]);

  useEffect(() => {
    const user = auth.currentUser;
    const coll = collection(db, 'Profile');

    const unSubscribe = onSnapshot(coll, snapshot => {
      setGetData1(
        snapshot.docs.map(doc => ({
          selecteduser: doc.data(),
        })),
      );
    });
    return () => {
      unSubscribe();
    };
  }, []);

  return (
    <>
      {userflag === 'user' ? (
        <View
          style={tw`mt-10 h-35 w-80 border-black items-center self-center `}>
          <Carousel
            loop
            width={350}
            height={height / 4}
            autoPlay={true}
            mode="parallax"
            parallaxScrollingScale={0.9}
            parallaxScrollingOffset={50}
            data={[...new Array(GetData3.length).keys()]}
            scrollAnimationDuration={1000}
            // onSnapToItem={(index) => console.log('current index:', index)}
            renderItem={({data, index}) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <Image
                  style={{width: '100%', height: '100%', borderRadius: 30}}
                  source={{uri: GetData3[index]?.selecteduser.img}}
                  resizeMode="contain"
                />
              </View>
            )}
          />
        </View>
      ) : (
        <LinearGradient
          colors={['#00B1E7', '#00B1E7']}
          style={tw`top-10 flex flex-row items-center justify-around self-center h-35 w-85 rounded-xl`}>
          {/* // balance dev */}
          <View style={tw`w-50 left-3`}>
            <Text
              numberOfLines={2}
              style={tw`text-xl font-bold  text-gray-100`}>
              {`Find Your Desire`}
            </Text>
            <Text
              numberOfLines={4}
              style={tw`text-xl font-bold  text-gray-100`}>
              {`Health Solution \nIn E-Doctor`}
            </Text>
          </View>

          {/* graph  */}
          <View
            style={tw` h-30 w-30  justify-center self-center items-center `}>
            <Image
              style={tw`h-29 w-30 rounded-2xl `}
              resizeMode="contain"
              source={require('../../Images/help.png')}
            />
          </View>
        </LinearGradient>
      )}
      {userflag === 'user' ? (
        <>
          <View style={tw`w-85 h-25 mt-12 `}>
            <Text style={tw`text-lg ml-5 font-bold text-black`}>
              {' '}
              Symptoms{' '}
            </Text>

            <View style={tw` flex-row  self-center mt-3  items-center`}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* card 1 */}

                <>
                  {GetData2?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        // console.log(item.label);

                        navigation.navigate('Yourplan', {
                          catt: item.selecteduser.catl.toLowerCase(),
                        });
                      }}>
                      <View
                        style={[
                          tw`h-20 w-30 ml-3  flex-col items-center justify-evenly `,
                        ]}>
                        <Image
                          style={tw`h-15 w-15  rounded-full `}
                          source={{uri: item.selecteduser.img}}
                        />
                        <Text
                          numberOfLines={1}
                          style={tw`text-center text-black w-25`}>
                          {item.selecteduser.company}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              </ScrollView>
            </View>
          </View>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Showbalance;

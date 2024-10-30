// AppContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

const AppContext = createContext();





const AppProvider = ({ children }) => {

    const [cat,setcat] = useState("")
    const [bankname,setbankname] = useState("")
    const [banktitle,setbanktitle] = useState("")
    const [bankacc,setbankacc] = useState("")
    const [vendoremail,setvendoremail] = useState("")
    const [cityy,setcity] = useState("")
    
    // useEffect(()=>{
    //    AsyncStorage.getItem("city").then((city)=>{
    //       // if (!cityy) {
    //         console.log("context api :",city);
            
    //         setcity(city)
    //       // }
         
    //    })
    // },[])

    const handleCategoryChange = (newCategory) => {
      setcat(newCategory);
    };

    const [state, setState] = useState({
        cart: [],
        // Add other pieces of state as needed
      });
    
      const addToCart = (product) => {
        setState((prevState) => {
        
          // prevState.cart.find(item =>  console.log("item : ",item.id));
          console.log("p id",product.id);
          const existingProduct = prevState.cart.find(item => item.id === product.id);
          console.log("item",existingProduct);
          if (existingProduct) {
            return {
              ...prevState,
              cart: prevState.cart.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              ...prevState,
              cart: [...prevState.cart, { ...product, quantity: 1 }],
            };
          }
        });
      };

      const decreaseQuantity = (productId) => {
        setState((prevState) => {
          const existingProduct = prevState.cart.find(item => item.id === productId);
          if (existingProduct) {
            if (existingProduct.quantity > 1) {
              return {
                ...prevState,
                cart: prevState.cart.map(item =>
                  item.id === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                ),
              };
            } else {
              return {
                ...prevState,
                cart: prevState.cart.filter(item => item.id !== productId),
              };
            }
          }
          return prevState;
        });
      };
    
    
      const updateCart = (productId, updatedProduct) => {
        setState((prevState) => ({
          ...prevState,
          cart: prevState.cart.map((product) =>
            product.id === productId ? updatedProduct : product
          ),
        }));
      };


      const removeFromCart = (productId) => {
        setState((prevState) => ({
          ...prevState,
          cart: prevState.cart.filter((product) => product.id !== productId),
        }));
      };

      const clearCart = () => {
        setState((prevState) => ({
          ...prevState,
          cart: [],
        }));
      };
//   const [state, setState] = useState({
//     name: '',
//     time: '',
//     age: null,
//     amount: 0,
//     picLink: '',
//     // Add other pieces of state as needed
//   });

//   const updateState = (key, value) => {
//     setState((prevState) => ({
//       ...prevState,
//       [key]: value,
//     }));
//   };

  return (
    <AppContext.Provider value={{ state,cat ,setcity,cityy, vendoremail,setvendoremail, setcat,setbankname,bankname,setbanktitle,banktitle,setbankacc,bankacc,  addToCart, updateCart, removeFromCart,decreaseQuantity,clearCart }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
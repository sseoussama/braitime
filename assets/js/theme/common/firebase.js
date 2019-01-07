// const firebase = require("firebase/app");
// require("firebase/database");
// require("firebase/storage");

// // require("firebase/auth");
// // require("firebase/messaging");
// // require("firebase/functions");
// // require("firebase/firestore");

// const config = {
//     apiKey: "xxx",
//     authDomain: "xxx",
//     databaseURL: "xxx",
//     projectId: "xxx",
//     storageBucket: "xxx",
//     messagingSenderId: "xxx"
// };
// // firebase.initializeApp(config);
// const db = firebase.database();
// const storage = firebase.storage();
// const storageRef = storage.ref();
// const imagesRef = storageRef.child('images');

// //firebase write
// export const fb = {
//     write: function(loc, data) {
//       db.ref(loc).set(data);
//     },
//     post: function(loc, data) {
//         var newPostKey = firebase.database().ref().child(loc).push().key;
//         data['id'] = newPostKey;
//         this.write(loc+'/'+newPostKey, data);
//     },
//     subscribe: function(loc) {
//         return db.ref(loc);
//     },
//     remove: function(loc) {
//         console.log('removing: ', loc);
//         db.ref(loc).remove();
//         db.ref(loc).set(null);
//     },
//     addImage: function(loc, name, file) {
//         name = this.slugify(name);
//         console.log('addImage:', file);
//         var fb = this;
//         var nodeRef = imagesRef.child(loc+'/'+name+".png");
//         nodeRef.put(file).then(function(snapshot) {
//             snapshot.ref.getDownloadURL().then(function(url) {
//                 fb.write('home/'+name+'/image', url);
//             });
//         });
//     },
//     addBrandImage: function(name, file) {
//         const slug = this.slugify(name);
//         console.log('addImage:', file);
//         var fb = this;
//         var nodeRef = imagesRef.child('brands/'+slug+".png");
//         nodeRef.put(file).then(function(snapshot) {
//             snapshot.ref.getDownloadURL().then(function(url) {
//                 fb.write('brand/'+slug+'/image', url);
//             });
//         });
//     },
//     addProductImage: function(loc, file, refPath, id) {
//         name = this.slugify(file.name);
//     	var fb = this;
//         var nodeRef = imagesRef.child(loc+'/'+name+".png");
//         nodeRef.put(file).then(function(snapshot) {
// 			snapshot.ref.getDownloadURL().then(function(url) {
//                 // fb.post(refPath, {url:url}); // firebase
// 				fb.postImage(url, id); // BC
// 			});
//         });
//     },
//     postImage: function(url, id) {
//         var settings = {
//             "async": true,
//             "crossDomain": true,
//             "url": "http://localhost:8090/api/postProductImage",
//             "method": "POST",
//             "headers": {
//                 "content-type": "application/json",
//             },
//             "processData": false,
//             "data": JSON.stringify({
//                 "image_file": null,
//                 "image_url": url,
//                 "product_id": id,
//                 "description": "blah"
//             })
//         }

//         $.ajax(settings).done(function (response) {
//           console.log(response);
//           window.location.href = window.location.pathname + window.location.search + window.location.hash;
//         });
//     },
//     slugify: function(TexT) {
//         TexT = TexT || "";
//         return TexT.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-') ;
//     }
// }






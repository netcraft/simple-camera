/*!
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
(function () {
  'use strict';

  var querySelector = document.querySelector.bind(document);

  var navdrawerContainer = querySelector('.navdrawer-container');
  var body = document.body;
  var appbarElement = querySelector('.app-bar');
  var menuBtn = querySelector('.menu');
  var main = querySelector('main');

  function closeMenu() {
    body.classList.remove('open');
    appbarElement.classList.remove('open');
    navdrawerContainer.classList.remove('open');
  }

  function toggleMenu() {
    body.classList.toggle('open');
    appbarElement.classList.toggle('open');
    navdrawerContainer.classList.toggle('open');
    navdrawerContainer.classList.add('opened');
  }

  main.addEventListener('click', closeMenu);
  menuBtn.addEventListener('click', toggleMenu);
  navdrawerContainer.addEventListener('click', function (event) {
    if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
      closeMenu();
    }
  });
})();


(function () {

	"use strict";

		var photo = document.getElementById('photo');
		var camera = document.getElementById('camera');
		var map = document.getElementById('map');
		var gallery = document.getElementById('gallery');
		var mainView = document.getElementById('main-view');
		var photoView = document.getElementById('photo-view');
		var position;
		var data = [
		];

		camera.addEventListener("change", newPhoto, false);
		window.addEventListener("popstate", newState, false);
		fillGallery();

		function fillGallery () {
			var savedData = readData();
			if (savedData) {
				data = savedData;
				buildGallery(data);
			}
		}

		function buildGallery (data) {

			if (gallery.children.length > 0) {
				gallery.innerHTML = "";
			}

			var fragment = document.createDocumentFragment();

			data.forEach(function (item, index) {

				var link = document.createElement("a");
				historify(link, index);

				var img = document.createElement("img");
				img.src = item.image;

				link.appendChild(img);

				var li = document.createElement("li");
				li.appendChild(link);

				fragment.appendChild(li)
			});

			gallery.appendChild(fragment);
		}

		function historify (link, index) {
			link.href = "/" + index;
			link.addEventListener("click", function (e) {
				e.preventDefault();

				history.pushState(
				    index, // data
				    "photo " + index, // name
				    link.href); // url

				showPhotoData(index);
			});
		}

		function newState (e) {
			var index = e.state;
			console.log("newState=%o", e);
			if (index) {
				showPhotoData(index);
			}
		}

		function showPhotoData (index) {
			var photo = data[index];
			console.log("showPhotoData=%o", index);
			showPhoto(photo.image);
			showMap(photo.position);
		}

		function showPhoto (dataURL) {
			photo.src = dataURL;
      		photo.removeAttribute("hidden");
		}

		function newPhoto () {
			var file = this.files[0];
	    	var reader = new FileReader();
			reader.onload = photoReady;
	    	reader.readAsDataURL(file);
		}

		function photoReady (e) {
			// e.target.result contains the Base64 DataURL
			showPhoto(e.target.result)
      		getPosition();
		}

		function getPosition () {
			navigator.geolocation.getCurrentPosition(function (newPosition) {
				position = newPosition;
				showMap(position);
				haveAllData();

			}, function () {}, {
				maximumAge: 0
			});
		}

		function haveAllData () {
			data.push({
				image: photo.src,
				position: position
			});
			saveData(data);
			buildGallery(data);
		}

		function saveData (data) {
			window.localStorage.setItem("serge-camera", JSON.stringify(data));
		}

		function readData () {
			return JSON.parse(
				window.localStorage.getItem("serge-camera")
			);
		}

		function showMap (position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;

			map.src = 'http://maps.googleapis.com/maps/api/staticmap?zoom=15&size=300x300&maptype=roadmap&markers=color:red%7Clabel:A%7C' + lat + ',' + lng+ '&sensor=false';

			map.removeAttribute("hidden");
		}

}());

import { storage, db } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";
import { push, ref as dbRef, set, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Función para subir imágenes
window.uploadImage = () => {
    const file = document.getElementById("imageInput").files[0];
    const album = document.getElementById("albumInput").value;
    const tags = document.getElementById("tagsInput").value;

    if (!file || !album) {
        alert("Selecciona un archivo y define un álbum.");
        return;
    }

    const storageRef = ref(storage, `images/${file.name}`);
    uploadBytes(storageRef, file)
        .then(snapshot => getDownloadURL(snapshot.ref))
        .then(url => {
            const imageRef = push(dbRef(db, 'images'));
            set(imageRef, {
                url: url,
                album: album,
                tags: tags.split(",").map(tag => tag.trim().toLowerCase()) // Normalizar etiquetas
            });
            alert("Imagen subida exitosamente.");
            loadImages();
        })
        .catch(error => console.error("Error al subir imagen:", error));
};

// Función para cargar imágenes en la galería
window.loadImages = (filteredKeys = null) => {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    const imagesRef = dbRef(db, 'images');
    get(imagesRef).then(snapshot => {
        snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();

            // Si no hay filtros, mostrar todas las imágenes
            if (!filteredKeys || filteredKeys.includes(childSnapshot.key)) {
                const imgDiv = document.createElement("div");
                imgDiv.classList.add("col-3", "mb-3");

                const img = document.createElement("img");
                img.src = data.url;
                img.classList.add("img-fluid", "rounded");

                const tags = document.createElement("p");
                tags.innerText = `Etiquetas: ${data.tags.join(", ")}`;

                imgDiv.appendChild(img);
                imgDiv.appendChild(tags);
                gallery.appendChild(imgDiv);
            }
        });
    });
};

// Función para buscar imágenes por etiquetas
window.searchImages = () => {
    const searchTags = document.getElementById("searchTagsInput").value.trim();
    if (!searchTags) {
        alert("Por favor, ingresa alguna etiqueta para buscar.");
        loadImages();
        return;
    }

    const searchTagsArray = searchTags.split(",").map(tag => tag.trim().toLowerCase()); // Normalizar entrada
    const imagesRef = dbRef(db, 'images');

    get(imagesRef).then(snapshot => {
        const matchedKeys = [];
        snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            const imageTags = data.tags.map(tag => tag.toLowerCase());

            // Verificar si alguna etiqueta ingresada coincide con las almacenadas
            if (searchTagsArray.some(tag => imageTags.includes(tag))) {
                matchedKeys.push(childSnapshot.key);
            }
        });

        if (matchedKeys.length > 0) {
            loadImages(matchedKeys);
        } else {
            alert("No se encontraron imágenes con esas etiquetas.");
            loadImages(); // Mostrar todas las imágenes si no hay coincidencias
        }
    }).catch(error => {
        console.error("Error al buscar imágenes:", error);
    });
};

// Cargar imágenes al inicio
document.addEventListener("DOMContentLoaded", () => loadImages());

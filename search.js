import { db } from './firebase-config.js';
import { ref as dbRef, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Función para buscar imágenes por etiquetas
window.searchImages = () => {
    const searchTagsInput = document.getElementById("searchTagsInput").value.trim();
    const gallery = document.getElementById("gallery");

    if (!searchTagsInput) {
        alert("Por favor, ingresa alguna etiqueta para buscar.");
        return;
    }

    const searchTagsArray = searchTagsInput.split(",").map(tag => tag.trim().toLowerCase());
    const imagesRef = dbRef(db, 'images');

    gallery.innerHTML = "<p>Buscando imágenes...</p>";

    get(imagesRef)
        .then(snapshot => {
            gallery.innerHTML = ""; // Limpiar la galería antes de mostrar resultados
            let found = false;

            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                const imageTags = data.tags.map(tag => tag.toLowerCase());

                // Verificar coincidencia de etiquetas
                if (searchTagsArray.some(tag => imageTags.includes(tag))) {
                    found = true;

                    // Crear elementos para la imagen
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

            if (!found) {
                gallery.innerHTML = "<p>No se encontraron imágenes con esas etiquetas.</p>";
            }
        })
        .catch(error => {
            console.error("Error al buscar imágenes:", error);
            gallery.innerHTML = "<p>Ocurrió un error al buscar imágenes.</p>";
        });
};

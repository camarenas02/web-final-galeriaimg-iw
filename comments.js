import { db } from './firebase-config.js';
import { ref as dbRef, push, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Función para cargar comentarios de una imagen
export function loadComments(imageId, commentsContainer) {
    const commentsRef = dbRef(db, `images/${imageId}/comments`);

    // Limpiar contenedor
    commentsContainer.innerHTML = "<p>Cargando comentarios...</p>";

    get(commentsRef)
        .then(snapshot => {
            commentsContainer.innerHTML = ""; // Limpiar antes de mostrar comentarios
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const comment = childSnapshot.val();
                    const commentDiv = document.createElement("div");
                    commentDiv.classList.add("comment");

                    commentDiv.innerHTML = `
                        <strong>${comment.user}:</strong> 
                        <p>${comment.text}</p>
                        <small>${comment.timestamp}</small>
                    `;
                    commentsContainer.appendChild(commentDiv);
                });
            } else {
                commentsContainer.innerHTML = "<p>No hay comentarios aún.</p>";
            }
        })
        .catch(error => {
            console.error("Error al cargar comentarios:", error);
            commentsContainer.innerHTML = "<p>Error al cargar comentarios.</p>";
        });
}

// Función para agregar un nuevo comentario
export function addComment(imageId, user, text) {
    const commentsRef = dbRef(db, `images/${imageId}/comments`);

    const newComment = {
        user: user || "Anónimo",
        text: text,
        timestamp: new Date().toLocaleString()
    };

    // Enviar el comentario a Firebase
    push(commentsRef, newComment)
        .then(() => {
            alert("Comentario añadido correctamente.");
        })
        .catch(error => {
            console.error("Error al enviar comentario:", error);
        });
}

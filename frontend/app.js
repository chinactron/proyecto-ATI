const API_URL = "http://127.0.0.1:5000"; //PONER URL DE LA API

cargarDocumentos();

/* IR A LOGIN O REGISTRO */
document.getElementById("btnIrARegistro").addEventListener("click", () =>{
    document.getElementById("divLogin").style.display = "none";
    document.getElementById("divRegistrar").style.display = "block";
})

document.getElementById("btnIrALogin").addEventListener("click", () =>{
    document.getElementById("divRegistrar").style.display = "none";
    document.getElementById("divLogin").style.display = "block";
})


/* REGISTRO */
document.getElementById("btnRegistro").addEventListener("click", async () => {
    const username = document.getElementById("txtRegistroUsuario").value;
    const password = document.getElementById("txtRegistroPassword").value;

    const response = await fetch(`${API_URL}/crear_usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const resultado = await response.json();
    alert(resultado.message || resultado.error);

    // Aca hay que validar errores cuando se trata de un usuario repetido
});


/* LOGIN Y LOGOUT */
document.getElementById("btnLogin").addEventListener("click", async () => {
    const username = document.getElementById("txtLoginUsuario").value;
    const password = document.getElementById("txtLoginPassword").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const resultado = await response.json();
        // token = resultado.token;
        localStorage.setItem("token", resultado.token);
        localStorage.setItem("idLogueado", resultado.idUsuario);
        document.getElementById("divLogin").style.display = "none";
        document.getElementById("divMenuPrincipal").style.display = "block";
        document.getElementById("txtLoginUsuario").value = "";
        document.getElementById("txtLoginPassword").value = "";
        // document.getElementById("task-form").style.display = "block";
        // fetchTasks();
    } else {
        alert("Credenciales inválidas.");
    }
});

document.getElementById("btnLogout").addEventListener("click", async () => {

    localStorage.removeItem("token");
    document.getElementById("divLogin").style.display = "block";
    document.getElementById("divMenuPrincipal").style.display = "none";
    document.getElementById("divRegistrar").style.display = "none";
    alert("Sesion cerrada.")
});


/* PROTECTED DE EJEMPLO (pide autorizacion en el header) */
document.getElementById("btnProtected").addEventListener("click", async () =>{
    const response = await fetch(`${API_URL}/protected`, {
        method: "GET",
        headers: { 
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
    });

    const resultado = await response.json();
    alert(resultado.message || resultado.error);
})


/* SUBIR ARCHIVO PDF */

document.getElementById("form-PDF").addEventListener("submit", async (event) => {
    event.preventDefault(); // Previene el envío del formulario por defecto

    const archivo = document.getElementById("pdfFile").files[0];
    if (!archivo) {
        alert("Por favor, selecciona un archivo PDF.");
        return;
    }

    const formData = new FormData();
    formData.append("file", archivo);

    try {
        const response = await fetch(`${API_URL}/upload/pdf`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert(`PDF subido con éxito: ${result.filename}`);
        } 
        else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error("Error al subir el archivo PDF:", error);
        alert("Ocurrió un error al intentar subir el archivo.");
    }
});


/* OBTENER PALABRAS CLAVE */
document.getElementById("btnGetPalabrasClave").addEventListener("click", async () => {
    const response = await fetch(`${API_URL}/getPalabrasClave/${localStorage.getItem("idLogueado")}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
    });

    const resultado = await response.json();
    alert(resultado.message || resultado.error)
    console.log(resultado)
})


/* AGREGAR PALABRA CLAVE */

document.getElementById("btnAgregarPalabraClave").addEventListener("click", async () => {
    const word = document.getElementById("txtPalabraClave").value;

    const response = await fetch(`${API_URL}/crearPalabraClave`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ word })
    });

    if (response.ok) {
        alert(resultado.message)
    } else{
        alert(resultado.error || resultado.message);
    }
})

/* SUBIR ARCHIVO DE PALABRAS CLAVE */

document.getElementById("form-txt").addEventListener("submit", async (event) => {
    event.preventDefault(); // Previene el envío del formulario por defecto

    const archivo = document.getElementById("txtFile").files[0];
    if (!archivo) {
        alert("Por favor, selecciona un archivo .txt.");
        return;
    }

    const formData = new FormData();
    formData.append("file", archivo);

    try {
        const response = await fetch(`${API_URL}/upload/txt`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Palabras clave subidas con éxito.`);
            console.log(result.keywords.join(", "));
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error("Error al subir el archivo .txt:", error);
        alert("Ocurrió un error al intentar subir el archivo.");
    }
});


/* ELIMINAR PALABRAS CLAVE */
// btnEliminarPalabraClave
// Va a haber un listado de las palabras en el front end? Ahi viene el id y elimino una?
document.getElementById("btnEliminarPalabraClave").addEventListener("click", async (idPalabraClave) => {

    const response = await fetch(`${API_URL}/eliminarPalabraClave/${idPalabraClave}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        alert(resultado.message)
    } else{
        alert(resultado.error || resultado.message);
    }
})


/* VER BUSQUEDAS ANTERIORES */
// btnVerBusquedas

// CARGAR DOCUMENTOS PARA BUSQUEDA
// Cargar lista de documentos
async function cargarDocumentos() {
    const response = await fetch(`${API_URL}/user/documentos`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    const data = await response.json();
    if (response.ok) {
        const listaDocumentos = document.getElementById("listaDocumentos");
        data.documents.forEach(doc => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = doc.id;
            checkbox.id = `doc-${doc.id}`;

            const label = document.createElement("label");
            label.htmlFor = `doc-${doc.id}`;
            label.textContent = doc.name;

            const br = document.createElement("br");
            listaDocumentos.appendChild(checkbox);
            listaDocumentos.appendChild(label);
            listaDocumentos.appendChild(br);
        });
    } else {
        alert("Error al cargar documentos: " + data.error);
        alert(data.details)
    }
}

/* REALIZAR BUSQUEDA */
// btnRealizarBusqueda

// REALIZA BUSQUEDA Y DEVUELVE PDF CON HIGHLIGHT
document.getElementById("form-busqueda").addEventListener("submit", async (event) => {
    event.preventDefault();

    const documentosSeleccionados = Array.from(document.querySelectorAll("#listaDocumentos input:checked"))
    .map(checkbox => checkbox.value);

    if (documentosSeleccionados.length === 0) {
        alert("Por favor, selecciona al menos un archivo PDF.");
        return;
    }

    const nombreBusqueda = document.getElementById("nombreBusqueda").value;

    try {
        const response = await fetch(`${API_URL}/busqueda`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idsDocumentos: documentosSeleccionados,
                nombreBusqueda: nombreBusqueda
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
            alert(errorData.details)
            return;
        }

        // Obtén el archivo PDF de la respuesta
        const blob = await response.blob();

        // Crea una URL temporal para el PDF
        const pdfUrl = URL.createObjectURL(blob);

        // Abre el PDF en una nueva pestaña
        window.open(pdfUrl, "_blank");

        // // Opcion para que se descargue
        // const link = document.createElement("a");
        // link.href = pdfUrl;
        // link.download = "resultado_busqueda.pdf"; // Nombre del archivo descargado
        // link.click();

    } catch (error) {
        console.error("Error al resaltar y mostrar el PDF:", error);
        alert("Error al procesar el archivo.");
    }
    URL.revokeObjectURL(pdfUrl);
})


/* EJEMPLOS */

document.getElementById("task-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = document.getElementById("task-input").value;

    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    if (response.ok) {
        fetchTasks();
        document.getElementById("task-input").value = "";
    }
});

async function fetchTasks() {
    const response = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const tasks = await response.json();
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.content;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

async function deleteTask(taskId) {
    await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
}
import customtkinter
import re
from tkinter import filedialog
from pdfminer.high_level import extract_pages, extract_text

customtkinter.set_appearance_mode("dark")
customtkinter.set_default_color_theme("dark-blue")

root = customtkinter.CTk()
root.geometry("500x350")

#Datos para simular la base de datos#
class Usuario:
    def __init__(self, nombre, contrasena):
        self.nombre = nombre
        self.contrasena = contrasena
    
usuario1 = Usuario("chinac", "elchelo")
usuario2 = Usuario("zgabo4", "lostussienvelez")

usuarios = {usuario1, usuario2}

usuarioLogueado = None

palabrasClave = {} 


def login():
    for u in usuarios:
        if(entry1.get() == u.nombre and entry2.get() == u.contrasena): 
            print("SI")
            global usuarioLogueado
            usuarioLogueado = u;
            mostrarFramePrograma()
    else: print("NO")

def openFile():
    filepath = filedialog.askopenfilename()
    archivo = open(filepath, 'rb')
    text = extract_text(archivo)
    print(text)

def agregarPalabrasClave():
    filepath = filedialog.askopenfilename() 
    with open(filepath, 'r', encoding='utf-8') as archivo:  # Abre el archivo en modo texto
        texto = archivo.read() 
        print(texto)
        # Separar las frases por comas
        palabras = re.split(r',\s*', texto)
        for palabra in palabras:
            palabrasClave[palabra] = 1
        print(palabrasClave)

def registrarse():
    mostrarFrameRegistro()

def confirmarRegistro():
    #NO HAY isEMPTY (QUEEEE)#
    if(entry1Registro.get() != "" and entry2Registro.get() != ""):
        usuarioNuevo = Usuario(entry1Registro.get(), entry2Registro.get())
        usuarios.add(usuarioNuevo)
        print("Se registró correctamente")
        mostrarFrameLogin()
    else:
        print("No se pudo registrar")

def mostrarFrameRegistro():
        frame.pack_forget()
        frameRegistro.pack(pady=20, padx=60, fill="both", expand=True)
    
def mostrarFrameLogin():
    frameRegistro.pack_forget()
    frame.pack(pady=20, padx=60, fill="both", expand=True)

def mostrarFramePrograma():
    frame.pack_forget()
    framePrograma.pack(pady=40, padx=80, fill="both", expand=True)

# LÓGICA PARA CERRAR SESIÓN #

def logOut():
    global usuarioLogueado
    print(usuarioLogueado.nombre)
    usuarioLogueado = None
    entry1.delete(0, "end")
    entry2.delete(0, "end")

    framePrograma.pack_forget()
    frame.pack(pady=40, padx=80, fill="both", expand=True)



# FRAME LOGIN #
frame = customtkinter.CTkFrame(master=root)
frame.pack(pady=20, padx=60, fill="both", expand=True)

label = customtkinter.CTkLabel(master=frame, text="Login")
label.pack(pady=12, padx=10)

entry1 = customtkinter.CTkEntry(master=frame, placeholder_text="Username")
entry1.pack(pady=12, padx=10)

entry2 = customtkinter.CTkEntry(master=frame, placeholder_text="Password", show="*")
entry2.pack(pady=12, padx=10)

button = customtkinter.CTkButton(master=frame, text="Login", command=login)
button.pack(pady=12, padx=10)

button = customtkinter.CTkButton(master=frame, text="No tengo cuenta", command=registrarse)
button.pack(pady=12, padx=135)

checkBox = customtkinter.CTkCheckBox(master=frame, text="Remember Me")
checkBox.pack(pady=12, padx=10)


# FRAME REGISTRO #
frameRegistro = customtkinter.CTkFrame(master=root)

labelRegistro = customtkinter.CTkLabel(master=frameRegistro, text="Registrarse")
labelRegistro.pack(pady=12, padx=10)

entry1Registro = customtkinter.CTkEntry(master=frameRegistro, placeholder_text="Username")
entry1Registro.pack(pady=12, padx=10)

entry2Registro = customtkinter.CTkEntry(master=frameRegistro, placeholder_text="Password", show="*")
entry2Registro.pack(pady=12, padx=10)

buttonRegistro = customtkinter.CTkButton(master=frameRegistro, text="Confirmar", command=confirmarRegistro)
buttonRegistro.pack(pady=12, padx=10)


# FRAME PROGRAMA #
framePrograma = customtkinter.CTkFrame(master=root)

labelPrograma = customtkinter.CTkLabel(master=framePrograma, text="Lector PDF PAAAAAAAAA")
labelPrograma.pack(pady=12, padx=10)

buttonPrograma = customtkinter.CTkButton(master=framePrograma, text="Adjuntar archivo",command=openFile)
buttonPrograma.pack(pady=15, padx=12)

buttonPrograma2 = customtkinter.CTkButton(master=framePrograma, text="Agregar palabras clave",command=agregarPalabrasClave)
buttonPrograma2.pack(pady=18, padx=20)

buttonLogOut = customtkinter.CTkButton(master=framePrograma, text="Log Out", command=logOut)
buttonLogOut.pack(pady=35, padx=130)

root.mainloop()
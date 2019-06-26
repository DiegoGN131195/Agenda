# Agenda
Examen Agenda

Script

	-Corre este script para crear la bd en el localdb

	CREATE DATABASE AgendaDatabase

	USE AgendaDatabase

	CREATE TABLE [dbo].[Agenda]
	(
		[Id] INT NOT NULL IDENTITY, 
	    [LastName] NVARCHAR(50) NOT NULL, 
	    [SecondLastName] NVARCHAR(50) NOT NULL, 
	    [Photo] NVARCHAR(MAX) NOT NULL, 
	    [Phone] NVARCHAR(20) NOT NULL, 
	    [FirstName] NVARCHAR(100) NOT NULL, 
	    CONSTRAINT [PK_Table] PRIMARY KEY ([Id])
	)


	-Si no creaste la bd en el local db tendras que cambiar la cadena de conexion en el archivo AppSettings localizado en el root del proyecto

		por default la cadena de conexion hace referencia al localdb

		Server=(localdb)\\MSSQLLocalDB;Database=AgendaDatabase;Trusted_Connection=True;MultipleActiveResultSets=true

	
Posibles errores

-Hay veces que al iniciar el proyecto en visual studio de error que no se encuentra algunos paquetes instalados "npm"
 
    Solucion: abre la carpeta ClientApp que se encuentra en el proyecto despues desde esta ruta abre un cmd y corre el siguiente comando npm install

-Si al iniciar el proyecto te da este error

		"TimeoutException: The Angular CLI process did not start listening for requests within the timeout period of 50 seconds. Check the log output for error information."

	 Solucion: Recarga la pagina, hay veces que se necesita repetir este proceso varias veces.

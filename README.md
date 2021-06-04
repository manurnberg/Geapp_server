# GEAPP (w)
## EJECUTAR APP EN AMBIENTE DE PRODUCCION Y LOCAL
### AMBIENTE LOCAL / DESARROLLO
- RUN BACKEND SERVER port 3000 (sin nodemon): `node server/app.js`
- RUN BACKEND SERVER port 3000 (nodemon): `npm run dev`
- RUN FRONTEND SERVER port 4200 (local): `cd frontend` y luego `ng serve` 

### AMBIENTE DE PRODUCCION (COMANDOS)
- START CON ECOSYSTEM (lo mas recomendable): `pm2 start ecosystem.config.js --env test` (el env tiene que ser `produccion`, ver archivo de ecosystem). Correrlo en el directorio que está el archivo de ecosystem.
- START EN STAND ALONE (podria hacerse esto si es solo 1 instancia. prefiero con ecosys): `sudo pm2 start app.js`
- CONFIGURA STARTUP AUTOMATICO AL REINICIAR SERVER: `sudo pm2 startup` (no me funciona)
- VER APPS INFO: `pm2 list` o `pm2 show 0` o `pm2 status` o `pm2 monit` 
- STOP INSTANCIA CON ID 0: `pm2 stop 0`
- PARA CREAR EL ARCHIVO DEFAULT DE ECOSYSTEM (ya se hizo para este proyecto): `pm2 ecosystem`
- VER LOGS DE TODAS LAS APPS: `pm2 logs` (tambien se podria ir al directorio de logs o poner el id de la instancia)
- NOTA: ACTUALMENTE SE TIENEN LAS INSTANCIAS DE TEST Y PRODUCCION EN EL MISMO SERVER Y PARA ESTO SE CORRIERON LOS 2 ECOSISTEMAS EN PARALELO: `pm2 start ecosystem.config.js && pm2 start ecosystem.config.js --env production`. (Se puede ver que esté en stop todo el ecosystem de test `pm2 stop ecosystem.config.js` cuando no se está desarrollando.) (Debajo del puerto 1024 se tiene que correr con `sudo`)
- `pm2 kill` para matar el pm2 y todas las instancias.

## A MEJORAR: 
- Bug en FE: No se está refrescando la lista cuando se modifica un usuario.
- Deploy a prod: correr `ng build --prod` y esto generará el codigo en `/frontend/dist/frontend` 
- Se debe copiar todo el contenido de esta carpeta al directorio en el server que se va a encontrar una carpeta analoga.
- Tener presente que todo el codigo va a estar compilado usando la configuracion de `environments.prod.js` por lo que va a apuntar a la url de produccion. (en este momento el FE del ambiente de test y prod están apuntando a prod)

## INSTALACION DE SERVER DE PRODUCCION
- https://ourcodeworld.com/articles/read/977/how-to-deploy-a-node-js-application-on-aws-ec2-server

### SELECCION DE INSTANCIA EC2 en AWS (Creación de instancia)
- Seleccionar: Setup Amazon Linux AMI 2018.03.0 (HVM), SSD Volume Type
- Uso de links para crear PPK y abrir puertos necesarios.
  - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html#putty-private-key
  - https://aws.amazon.com/premiumsupport/knowledge-center/convert-pem-file-into-ppk/

### INSTALACION DE MYSQL EN AWS
- https://medium.com/@chamikakasun/installing-mysql-in-an-ec2-instance-55d6a3e19caf
1. `sudo su`
2. `yum install mysql-server`
3. `chkconfig mysqld on` (para levantar automatico cuando se hace reboot)
4. `service mysqld start` (para levantar la instancia)
5. `/usr/libexec/mysql55/mysqladmin -u root password 'your-password'` (para crear un nuevo root user y pass)
6. `mysql -uroot -p` (para conectarse y probar con el password creado anteriormente)
7. `select user, password, host from mysql.user;` (para ver salida de usuarios)
8. `GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'your-password' WITH GRANT OPTION;` (para acceder a mysql desde afuera y darle privilegios para crear user y grants)
9. `FLUSH PRIVILEGES;`
10. _NOTA: recordá abrir los puertos necesarios si se quiere usar workbench o alguna herramienta asi._

### INSTALACION DE NODEJS EN AWS (RHAT 7)
- https://tecadmin.net/install-latest-nodejs-and-npm-on-centos/
1. `sudo yum install -y gcc-c++ make`
2. `sudo curl -sL https://rpm.nodesource.com/setup_12.x | sudo -E bash -`
3. `sudo yum install -y nodejs`
4. `nodejs -version`

### EJECUTAR PRUEBA RAPIDA EN AWS
1. Copiar proyecto a algun directorio del server o descargar de github, gitlab, etc.
2. `npm install` (instalar npm en el directorio donde esta el package.json)
	`_WARN que me apareció: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.9: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})_`
3. `npm run dev` (corrida rapida en dev para probar que funcione el server)
4. probar que se encuentre funcionando algún WS (recorda abrir los puertos necesarios en la consola AWS): http://ec2-18-231-45-56.sa-east-1.compute.amazonaws.com:3000/api/election/
5. `Ctrl+C` (apagar la instancia levantada)

### INSTALACION DE PM2 en AWS
1. `sudo npm install pm2 -g` (lo instala de forma global, para todos los proyectos).
2. para ver el resto de los comandos de pm2 ir a la ejecución en ambientes de producción.
3. tener en cuenta que cuando se generó el archivo de ecosystema se guardó junto con el código.

### FUNCIONAL.
1. Tener presente que siempre se tiene que tener una sola votacion activa. (La votacion se debe cerrar de manera manual al finalizar la elección.)
2. Tiene que haber mesas abiertas para esa votacion.
3. Dentro de los votantes de cada una de esas mesas tienen que ser dueños (isOwner) de la mesa para poder cargar información. (Se permite tener mas de un dueño por cada mesa, ya que hay situaciones que hay mas de un fiscal por mesa)
4. Cuando se carga el escrutinio final se toma la mesa como cerrada y no se permite cargar mas votantes, reposicion de boletas o modificar los datos del escrutinio final.
5. Tener en la tabla configs code:DEFAULT_HELP_PHONE / value: +5412341234 para que se cargue por default a cada usuario el telefono de ayuda.

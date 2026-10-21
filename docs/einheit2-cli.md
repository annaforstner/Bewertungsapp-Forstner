# Einheit 2

## cli- Statements
   70  sudo /Applications/XAMPP/xamppfiles/xampp start
   71  sudo /Applications/XAMPP/xamppfiles/xampp status
   72  cd /Applications/XAMPP/xamppfiles/xampp
   73  cd/Applications/XAMPP/xamppfiles/xampp
   74  cd/applications
   75  cd /Applications
   76  cd /XAMPP
   77  ls -l
   78  cd XAMPP
   79  ls -l
   80  cd htdocs
   81  ls -l
   82  cd GitHub
   83  ls
   84  cd Bewertungsapp-Forstner
   85  ls -l
   86  history
   87  mkdir bewertungsapp-api
   88  cd bewertungsapp-api
   89  npm init -y
   90  npm install express cors morgan sequelize cookie-parser mysql2
   91  npm install --save-dev sequelize-cli
   92  npm start
   93  npx sequelize-cli init
   94  npx sequelize-cli db:create
   95  npx sequelize-cli model:generate --name Team --attributes name:string,klasse:string
   96  npx sequelize-cli model:generate --name Member --attributes teamId:integer,vorname:string,nachname:string
   97  npx sequelize-cli model:generate --name Project --attributes teamId:integer,titel:string,beschreibung:text,praesentiertAm:date
   98  npx sequelize-cli model:generate --name Criterion --attributes name:string,maxScore:integer,weight:float
   99  npx sequelize-cli model:generate --name Juror --attributes name:string,email:string
  100  npx sequelize-cli model:generate --name Evaluation --attributes projectId:integer,criterionId:integer,jurorId:integer,score:integer,comment:text
  101  npx sequelize-cli db:migrate
  102  history
  103  npx sequelize-cli db:migrate:undo:all
  104  npx sequelize-cli db:migrate
  105  npx sequelize-cli db:migrate:status


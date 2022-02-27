cd ~/Desktop
mongoexport --db ScolioDatabase --collection Korisnici --out ./Korisnici.json
mongo ScolioDatabase --eval "db.dropDatabase();"
# FFBE Espers Simulator

Things left to do before beta:
[x] Change the star selector
[x] Add the star max for each espers in the db: the generation script should take that db into account and the db should not be in the git, only an example
[ ] Possibility to share builds would be really good (and not that hard to code, come on).

Ideas to implement:
- Images in center to know what esper we are looking at right away
- Example builds
- GL version
- Figure out translation from what is already translated
- ~~Saving builds?~~ Will need a dynamic db, not now.

Point to think about while coding or before submitting features:
- Keeping the less possible data in the code itself: we want to rely on scripts and game files to generate the data, we don't want to maintain the data and have to compile again to update data. It also mean that I don't think we should include data that is not in the files and it might mean say no to real numbers but that should be fixed by the game itself before the end of 2017 (for JP version anyway).
- Keeping configuration out of the code.
- Having multiple files for DB and lazy loading. We don't want the app to be as fast as possible. 
- Staying on fewer frameworks. Right now are using React and Mobx with nwb. Might use Firebase when need a dynamic database.

Problems known:
- You do need to compile again the code to copy the public/data folder in dist/data (or do it manually). The problem of putting the data directly in dist means it won't work while you are developing since nwb uses the folder public. I'll probably add an option in generatedb.js to create files also in dist/data.

Requirements:
- Node 6.10 with npm (yarn is better) installed

How to install:
- create folders tmp and public/data
- copy .env.template to .env
- yarn install (or npm i)
- node script/generatedb.js ja
- yarn build / yarn start (or npm run build / npm run start)

# FFBE Espers Simulator

Things left to do before beta:
[x] Change the star selector
[ ] Add the star max for each espers in the db: the generation script should take that db into account and the db should not be in the git, only an example
[ ] Possibility to share builds would be really good (and not that hard to code, come on).

Ideas to implement:
- Images in center to know what esper we are looking at right away
- Example builds
- GL version
- Figure out translation from what is already translated
- ~~Saving builds?~~ Might need too much db for now.


Point to think about while coding or before submitting features:
- Keeping the less possible data in the code itself: we want to rely on scripts and game files to generate the data, we don't want to maintain the data and have to compile again to update data. It also mean that I don't think we should include data that is not in the files and it might mean say no to real numbers but that should be fixed by the game itself before the end of 2017 (for JP version anyway).
- Keeping configuration out of the code.
- Having multiple files for DB and lazy loading. We don't want the app to be as fast as possible. 
- Staying on fewer frameworks. Right now are using React and Mobx. Might use Firebase when need a dynamic database.

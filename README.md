# SlidingPuzzle
This repository implements the sliding puzzle game. The player must move the pieces orthogonally in order to make the numbers in ascending order. In order to create a solvable puzzle, the steps presented in <https://developerslogblog.wordpress.com/2020/04/01/how-to-shuffle-an-slide-puzzle/> are used.

1. Convert the puzzle to an array
1. Shuffle using the [Fisher-Yates](https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array) algorithm
1. Check if an slide puzzle is solvable or not
1. If not, turn it into a solvable onde

There is a **solve** button, that solves the puzzle by using A*, as described in <https://abnerrjo.github.io/blog/2015/12/06/solving-the-sliding-puzzle/>.

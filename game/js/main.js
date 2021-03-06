// Lynne Okada, Taylor Dinwiddie, Peter Tieu
// Wall-et Defense Game for CMPM120/ARTG120

var game = new Phaser.Game(1024, 1024, Phaser.AUTO, 'wall-et');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', gamePlayState);
game.state.add('playTwo', gameplayTwoState);
game.state.add('over', gameOverState);
game.state.add('tutorial', tutorialState);
game.state.add('credits', creditsState);
game.state.add('controls', controlsState);



game.state.start('boot');

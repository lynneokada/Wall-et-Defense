// Lynne Okada, Taylor Dinwiddie, Peter Tieu
// Wall-et Defense Game for CMPM120/ARTG120

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'wall-et');

// game.state.add('boot', bootState);
// game.state.add('load', loadState);
game.state.add('menu', menuState);

game.state.start('menu');

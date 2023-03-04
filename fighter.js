const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

//background
const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: './img/background1.png'
})

//shop
const shop = new Sprite({
    position: {
        x:630,
        y:128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

//player
const player = new Fighter({
    position: {
    x:0,
    y:0
    },
    velocity:{
    x:0,
    y:0
    },
    offset: {
    x:0,
    y:0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        }
    }
})


//enemy 
const enemy = new Fighter({
    position: { 
    x:canvas.width - 50,
    y:0
    },
    velocity: {
    x:0,
    y:0
    },
    offset: {
    x:-50,
    y:0
    },
    color: 'blue'
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    j: {
        pressed: false
    },
    l: {
        pressed: false
    }
}


decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    //enemy.update()

    // player movement
    player.velocity.x = 0

    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.image = player.sprites.run.image
    } else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.image = player.sprites.run.image
    } else {
        player.image = player.sprites.idle.image
    }

    // enemy movement
    enemy.velocity.x = 0

    if(keys.j.pressed && enemy.lastKey === 'j') {
        enemy.velocity.x = -5
    } else if(keys.l.pressed && enemy.lastKey === 'l') {
        enemy.velocity.x = 5
    }

    //detect for collision
    //player
    if(
        rectangularCollision({
            rectangle1:player,
            rectangle2:enemy
        }) &&
         player.isAttacking
         ) {
         player.isAttacking = false
         enemy.health -= 10
         document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }
    //enemy 
    if(
        rectangularCollision({
            rectangle1:enemy,
            rectangle2:player
        }) &&
         enemy.isAttacking
         ) {
         enemy.isAttacking = false
         player.health -= 10
         document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    //end game based on health
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player,enemy,timerId})
    }
}

animate()

window.addEventListener('keydown' , (event)=>{
    switch(event.key) {
        // player keys
        case 'd' :
            keys.d.pressed = true
            player.lastKey = 'd'
            break
         case 'a' :
            keys.a.pressed = true
            player.lastKey = 'a'
            break
         case 'w' :
            player.velocity.y = -20
            break
         case ' ' :
            player.attack()
            break
        // enemy keys
         case 'l' :
            keys.l.pressed = true
            enemy.lastKey = 'l'
            break
         case 'j' :
            keys.j.pressed = true
            enemy.lastKey = 'j'
            break
         case 'i' :
            enemy.velocity.y = -20
            break
         case '=' :
            enemy.attack()
            break
    }
    
})
window.addEventListener('keyup' , (event)=>{
    //player keys
    switch(event.key) {
        case 'd' :
            keys.d.pressed = false
            break
        case 'a' :           
            keys.a.pressed = false
            break
    }
    //enemy keys
    switch(event.key) { 
        case 'l' :
            keys.l.pressed = false
            break
        case 'j' :           
            keys.j.pressed = false
            break
    }
    
})

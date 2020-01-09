var cars = [];

var car1 = {
    name: 'sonata',
    ph: "500ph",
    start: function () {
        console.log("sonata engine is starting");
    },
    stop: function () {
        console.log("sonata engine is stoped");
    }
}
var car2 = {
    name: 'BMW',
    ph: "600ph",
    start: function () {
        console.log("BMW engine is starting");
    },
    stop: function () {
        console.log("BMW engine is stoped");
    }
}

var car3 = {
    name: 'Ford',
    ph: "600ph",
    start: function () {
        console.log("Ford engine is starting");
    },
    stop: function () {
        console.log("Ford engine is stoped");
    }
}
cars[0] = car1;
cars[1] = car2;
cars[2] = car3;

console.log(cars[0].name);
console.log(cars[0].ph);
cars[0].start();
cars[0].stop();

console.log(cars[1].name);
console.log(cars[1].ph);
cars[1].start();
cars[1].stop();

console.log(cars);


for(var i = 0; i < cars.length; i++){
    console.log(cars[i].name);

    if(cars[i].name == "BMW"){
        console.log("BMW Find!!");
    }
}


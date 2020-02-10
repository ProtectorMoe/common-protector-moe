var a = [3, 654, 31, 456, 789, 10, 31, 3, 1, 46, 7];

for (let i in a) {
    console.log(i, a[i]);
    if (a[i] % 2 == 0) {
        a.splice(i, 1);
    }
}
console.log(a);

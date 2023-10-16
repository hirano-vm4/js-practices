function fizzBuzz(n) {
  if (!Number.isInteger(n) || n < 1) {
    console.log("1以上の整数を入力してください");
    return;
  }

  for (let num = 1; num <= n; num++) {
    let output = "";
    if (num % 3 === 0) output += "Fizz";
    if (num % 5 === 0) output += "Buzz";
    console.log(output || num);
  }
}

fizzBuzz(20);

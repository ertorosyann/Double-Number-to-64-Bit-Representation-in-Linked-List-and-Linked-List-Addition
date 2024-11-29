import { encodeIEEE754_64 , decodeIEEE754_64 } from "./Simulate IEEE 754.js";

class Node {
    constructor(bit) {
      this.bit = bit; // Should be 0 or 1
      this.next = null;
    }
}
  
class LinkedList {
    constructor() {
      this.head = null;
    }

    static fromDouble(number) {
        let list = new LinkedList();

        let obj =  encodeIEEE754_64(number);    
        list.head = new Node(obj.sign);

        let cur = list.head;
        let ieef =  obj.exponent + obj.fraction;
        
        for (let i = 0; i < ieef.length; i++) {
            cur.next = new Node(ieef[i]);    
            cur = cur.next;            
        }

        return list;
    }
  
    toDouble() {
      // TODO: Implement this method
    }
  
    static add(listA, listB) {
      // TODO: Implement this method
        let ieef_listA = {};
        let number1 = ('' + listA.toBinaryString()).replaceAll('->', '');        
        let ieef_listB = {};
        let number2 = ('' + listB.toBinaryString()).replaceAll('->', '');

        ieef_listA.sign = number1.slice(0,1);
        ieef_listB.sign = number1.slice(0,1);

        ieef_listA.exponent = number1.slice(1,12);
        ieef_listB.exponent = number1.slice(1,12);        

        ieef_listA.fraction = number1.slice(12);
        ieef_listB.fraction = number2.slice(12);
                
        

        let num1_exponent_decimal = parseInt(ieef_listA.exponent, 2);
        let num2_exponent_decimal = parseInt(ieef_listB.exponent, 2)
        let sub = num1_exponent_decimal - num2_exponent_decimal;

        let shift = Math.abs(sub);
        if (sub > 0) {
            ieef_listB.fraction = ('0'.repeat(shift) + ieef_listB.fraction).slice(0, 52);
        } else if (sub < 0) {
            ieef_listA.fraction = ('0'.repeat(shift) + ieef_listA.fraction).slice(0, 52);
        }
        

       // let resMantisa = parseFloat('1.' + ieef_listA.fraction, 2) + parseFloat('1.' + ieef_listB.fraction, 2);
        let fractionA = parseInt(ieef_listA.fraction, 2) / Math.pow(2, 52);
        let fractionB = parseInt(ieef_listB.fraction, 2) / Math.pow(2, 52);
        let resMantisa = (1 + fractionA) + (1 + fractionB);

        //
        let BinaryResMantisa = resMantisa.toString(2);

        // find index of first 1 and add '.' before first 1
        let indexPoint = BinaryResMantisa.indexOf('.')
        BinaryResMantisa = BinaryResMantisa.replace('.', '');
        BinaryResMantisa = BinaryResMantisa[0] + '.' + BinaryResMantisa.slice(1);

        //
        let exp = (num1_exponent_decimal +  indexPoint - 1).toString(2);
        exp = exp.padStart(11, '0');   
        
        let sign = ieef_listA.sign === ieef_listB.sign ? ieef_listA.sign : (resMantisa < 0 ? 1 : 0);
        
        let resBin = "" + sign + exp + (BinaryResMantisa.slice(2).padEnd(52, '0'));
        console.log(decodeIEEE754_64(resBin));
        
    }

    toBinaryString() {
        let cur = this.head;
        let res = '';

        while(cur) {
            res += cur.bit + '->'
            cur = cur.next;
        }
        return res ;
    }
}


const listA = LinkedList.fromDouble(2,3);
const listB = LinkedList.fromDouble(2.2);


const result = LinkedList.add(listA, listB);
// console.log(listA.toBinaryString().length)


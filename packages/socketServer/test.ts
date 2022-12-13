const enumerable = (
  target: any,
  memberName: string,
  propertyDescriptor: PropertyDescriptor
) => {
  propertyDescriptor.enumerable = true;
};

// class Person {
//   firstName = "Jon";
//   lastName = "Doe";

//   @enumerable
//   fullName() {
//     return `${this.firstName} ${this.lastName}`;
//   }
// }

// console.log(new Person().fullName());

console.log(typeof enumerable);

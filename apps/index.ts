export {};

// Метод для получения списка сотрудников через API1
const getEmployees = async () => {
  // Эмулируем вызов API через возврат промиса
  return Promise.resolve([
    { id: 1, name: 'Вася', department: 'Frontend' },
    { id: 2, name: 'Петя', department: 'Backend' },
    { id: 3, name: 'Дима', department: 'Frontend' },
    { id: 4, name: 'Оля', department: 'Backend' },
    { id: 5, name: 'Саша', department: 'Frontend' },
    { id: 6, name: 'Олег', department: 'Testing' },
  ]);
};

// Зарплаты сотрудников из API
const getEmployeeSalary = async (employeeId: number) => {
  // Эмулируем вызов API через возврат промиса
  const salaryByEmployeeId = {
    '1': 10000,
    '2': 12000,
    '3': 10500,
    '4': 15000,
    '5': 8000,
    '6': 9000,
  };

  return Promise.resolve(salaryByEmployeeId[employeeId]);
};

// *********************************************************

const getAllEmployees = async () => {
  const result = await getEmployees();
  const backend = result.filter((item) => {
    if (item.department === 'Backend') return item;
  });
  console.log('getAllEmployees', backend);
};

const getMaxSalary = async () => {
  let maxSalary = 0;
  let i = 1;
  let process = true;
  while (process) {
    try {
      const salary = await getEmployeeSalary(i);
      if (!salary) process = false;

      if (salary === 0) ++i;

      if (salary >= maxSalary) {
        maxSalary = salary;
        ++i;
      } else ++i;
    } catch (error) {
      process = false;
      return maxSalary;
    }
  }
  return maxSalary;
};

const getF = async () => {
  let totalDepartmentsSpends = [];

  for (let i = 1; i <= 6; i++) {
    const salary = await getEmployeeSalary(i);
    totalDepartmentsSpends.push([i, salary]);
  }

  const sortedSalary = totalDepartmentsSpends.sort((a, b) => b[1] - a[1]);

  const employees = await getEmployees();
  const names = sortedSalary.map((salary) => {
    const empl = employees.find((emp) => {
      if (emp.id === salary[0]) {
        return emp;
      }
    });
    return { id: empl.id, name: empl.name, salary: salary[1] };
  });
  console.log('🚀 ~ getF ~ names:', names);
};

const superLastTask = async () => {
  const Departments = ['Frontend', 'Backend', 'Testing'];

  const employees = await getEmployees();
  let totalDepartmentsSpends = [];
  for (let dep of Departments) {
    let depRecord = { department: dep, spends: 0 };

    for (let empl of employees) {
      if (empl.department === dep) {
        const spend = await getEmployeeSalary(empl.id);
        depRecord.spends += spend;
      }
    }

    totalDepartmentsSpends.push(depRecord);
  }
  console.log('totalDepartmentsSpends:', totalDepartmentsSpends);

  const totalEmployees = Departments.map((dep) => {
    const totalEmployees = employees.reduce((acc, cur, i) => {
      return cur.department === dep ? (acc += 1) : acc;
    }, 0);
    return { department: dep, totalEmployees };
  });

  console.log('totalEmployees:', totalEmployees);
};

// await superLastTask();

// Дано:
// 1. Функция для получения списка сотрудников через API1
// 2. Функция для получения зарплаты каждого сотрудника через API2

// Необходимо реализовать функции, которые вернут в качестве результата:
// 1. Список сотрудников только Backend
// 2. Размер максимальной зарплаты
// 3. Список имен сотрудников, отсортированный по размеру зарплаты
// 4. Статистика по каждому отделу: сумма затрат, количество сотрудников, средняя з/п, максимальная з/п

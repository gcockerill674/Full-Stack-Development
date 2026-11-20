async function loadData() {
    // Get the data from the API
    const studentResponse = await fetch('http://localhost:3200/api/students');
    const studentData = await studentResponse.json();
    for (let student of studentData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student['first-name']}</td>
            <td>${student['last-name']}</td>
            <td>${student.email}</td>
        `;
        document.querySelector('student-table').appendChild(row);
    }

    const facultyResponse = await fetch('http://localhost:3201/api/faculty');
    const facultyData = await facultyResponse.json();
    for (let faculty of facultyData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${faculty['first-name']}</td>
            <td>${faculty['last-name']}</td>
            <td>${faculty.email}</td>
        `;
        document.querySelector('#faculty-table tbody').appendChild(row);
    }

}
const BASE_URL = "http://localhost:4500";
export const studentClasses = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
  { label: "11", value: 11 },
  { label: "12", value: 12 },
];

export const getToken = () => {
  let userData = localStorage.getItem("userData") && JSON.parse(localStorage.getItem("userData") || "")

  if (userData && userData.token && userData.role) {
    return userData;
  } else {
    return null;
  }
};

export const setToken = (userData: any) => {
  localStorage.setItem("userData", JSON.stringify(userData));
};

export const studentLogin = async (userType: string, body: any) => {
  const response = await fetch(`${BASE_URL}/${userType}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }
  return response.json();
};

export const studentSignup = async (userType: string, body: any) => {
  if (userType == "teacher") {
    delete body.Class;
  }

  const response = await fetch(`${BASE_URL}/${userType}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }
  return response.json();
};

export const getStudentDetails = () => {
  return (
    localStorage.getItem("studentDetails") &&
    JSON.parse(localStorage.getItem("studentDetails") || "")
  );
};

export const setStudentDetails = (studentDetails: any) => {
  localStorage.setItem("studentDetails", JSON.stringify(studentDetails));
};

export const getStudentsAssignments = async () => {
  let userData = getToken();

  const response = await fetch(
    `${BASE_URL}/${userData.role}/class-assignments`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

export const getStudentsAttemptedAssignments = async (studentId: number) => {
  let userData = getToken();

  const response = await fetch(
    `${BASE_URL}/${userData.role}/attempted-assignments/${studentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

export const attemptAssignment = async (assignmentId: any) => {
  let userData = getToken();

  const response = await fetch(
    `${BASE_URL}/${userData.role}/class-assignment/${assignmentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

export const submitAssignment = async (answers: any, assignmentId: number) => {
  let userData = getToken();

  const response = await fetch(
    `${BASE_URL}/${userData.role}/submit-answers/${assignmentId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token,
      },
      body: JSON.stringify({ answers: answers }),
    }
  );

  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

export const getAllTeacherAssignments = async () => {
  let userData = getToken();

  const response = await fetch(`${BASE_URL}/${userData.role}/assignments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: userData.token,
    },
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

export const getAssignmentWithID = async (assignmentId: any) => {
  let userData = getToken();

  const response = await fetch(
    `${BASE_URL}/teacher/assignments/${assignmentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

export const createAssignment = async (body: any) => {
  let userData = getToken();

  const response = await fetch(`${BASE_URL}/assignment/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: userData.token,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

export const updateAssignment = async (body: any, assignmentId: number) => {
  let userData = getToken();

  const response = await fetch(
    `${BASE_URL}/assignment/update/${assignmentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: userData.token,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

export const logout = () => {
  localStorage.removeItem('studentDetails');
  localStorage.removeItem('userData');
}
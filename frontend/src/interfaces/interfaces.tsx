enum ToastType {
  SUCCESS = "Successfuly Done",
  ERROR = "Error",
  EMPTYVALUE = "Empty",
  NOTHING = ""
}

interface Student {
  id: number;
  name: string;
  email: string;
  class: number;
  userType: number;
}

interface Teacher {
  id: number;
  name: string;
  email: string;
  userType: number;
}

interface AssignmentQuestion {
  question: string;
  options: string[];
  answer: number;
}

interface Toast {
  title: string,
  type: ToastType,
  details: string,
  showToast: boolean
}
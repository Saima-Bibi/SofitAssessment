const validationRules = {
    '/CreateUser': {
        name: { required: true, type: 'string', maxLength: 15, regex: /^[a-zA-Z ]{3,15}$/ },
        email: { required: true, type: 'string', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        password: { required: true, type: 'string',minLength: 8 , maxLength: 8, regex: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/ },
       role:{ 
        required: true,  type: 'string',  regex: /^(admin|employee)$/ 
    }
    },
    '/login': {
        email: { required: true, type: 'string', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        password: { required: true, type: 'string',minLength: 8, maxLength: 8, regex: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/  }
    },
    '/updateUser/:id':
    { name: { required: true, type: 'string', maxLength: 15, regex: /^[a-zA-Z ]{3,15}$/ },
    email: { required: true, type: 'string', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { required: true, type: 'string',minLength: 8 , maxLength: 8, regex: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/ },
   role:{ 
    required: true,  type: 'string',  regex: /^(admin|employee)$/ 
}},
'/addOfficeTimings':{
    startTime:{ type:"string" , required: true, regex: /^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/ },
    endTime:{ type:"string" , required: true, regex: /^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/},
}

    
};

export default validationRules
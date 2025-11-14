# Security Implementation: Password Hashing & Input Validation

## 🔐 PASSWORD HASHING

### Overview
Passwords are **NEVER stored in plain text**. They are hashed using **bcryptjs** with a salt rounds of 10, making them cryptographically secure.

### Implementation Location

**File:** `server/src/controllers/authController.js`

### 1. Registration - Password Hashing

**Lines 26-27:**
```javascript
console.log('Hashing password...');
const hashedPassword = await bcrypt.hash(password, 10);
```

**Full Context (Lines 7-44):**
```javascript
exports.register = async (req, res) => {
  try {
    let { name, email, phone, password, role } = req.body;
    // ... validation checks ...
    
    // 🔐 HASHING HAPPENS HERE
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,  // ✅ Hashed password stored, NOT plain text
        role: userRole
      },
    });
    // ...
  }
};
```

**Key Points:**
- Uses `bcrypt.hash(password, 10)` where `10` is the salt rounds (cost factor)
- Higher salt rounds = more secure but slower
- Salt rounds of 10 is industry standard
- The original password is **never stored** - only the hash

### 2. Login - Password Verification

**Line 66:**
```javascript
const isMatch = await bcrypt.compare(password, user.password);
```

**Full Context (Lines 46-82):**
```javascript
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // ... find user ...
    
    // 🔐 PASSWORD VERIFICATION
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    // ... generate JWT token ...
  }
};
```

**Key Points:**
- Uses `bcrypt.compare()` to verify plain text password against stored hash
- Returns `true` if password matches, `false` otherwise
- The comparison is secure - even if database is compromised, original passwords cannot be recovered

### 3. Dependencies

**File:** `server/package.json` (Line 15)
```json
"bcryptjs": "^2.4.3"
```

### 4. Other Hashing Locations

- **Admin Controller:** `server/src/controllers/adminController.js`
  - Line 333: When updating user password
  - Line 367: When creating new user
  
- **Seed Files:** Used for creating test users
  - `server/seed.js` (Line 12)
  - `server/prisma/seed.js` (Lines 13-15)

---

## ✅ INPUT VALIDATION

### Overview
Comprehensive client-side validation ensures data quality and security **before** it reaches the server.

### Implementation Locations

### 1. LOGIN FORM VALIDATION

**File:** `client/src/components/auth/Login.js`

#### Validation Functions (Lines 26-45):

```javascript
// Email Validation
const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

// Password Validation
const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return '';
};
```

#### Validation Triggers (Lines 47-86):

1. **On Blur (Field Leave):** Lines 47-59
   ```javascript
   const handleBlur = (e) => {
     const { name, value } = e.target;
     setTouched((prev) => ({ ...prev, [name]: true }));
     // Validates when user leaves the field
   };
   ```

2. **Real-time (While Typing):** Lines 61-76
   ```javascript
   const handleChange = (e) => {
     // Real-time validation if field has been touched
     if (touched[name]) {
       // Validates as user types (after first blur)
     }
   };
   ```

3. **On Submit:** Lines 78-86
   ```javascript
   const validateForm = () => {
     // Validates all fields before submission
     return !newErrors.email && !newErrors.password;
   };
   ```

#### Visual Feedback (Lines 195-234):
- Red borders on invalid fields
- Error messages below fields
- Prevents form submission if validation fails

---

### 2. REGISTRATION FORM VALIDATION

**File:** `client/src/components/auth/Register.js`

#### Validation Functions (Lines 45-119):

```javascript
// 1. Name Validation (Lines 45-59)
const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters long';
  if (name.trim().length > 50) return 'Name must be less than 50 characters';
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return '';
};

// 2. Email Validation (Lines 61-70)
const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

// 3. Phone Validation (Lines 72-90)
const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number';
  }
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return 'Phone number must contain at least 10 digits';
  }
  if (digitsOnly.length > 15) {
    return 'Phone number is too long';
  }
  return '';
};

// 4. Password Strength Validation (Lines 92-109)
const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  return '';
};

// 5. Confirm Password Validation (Lines 111-119)
const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (confirmPassword !== password) {
    return 'Passwords do not match';
  }
  return '';
};
```

#### Validation Triggers (Lines 121-199):

1. **On Blur:** Lines 121-148
   - Validates when user leaves a field
   - Special handling: When password changes, re-validates confirm password

2. **Real-time:** Lines 150-180
   - Validates as user types (after field has been touched)
   - Dynamic confirm password re-validation

3. **On Submit:** Lines 182-199
   ```javascript
   const validateForm = () => {
     const newErrors = {
       name: validateName(formData.name),
       email: validateEmail(formData.email),
       phone: validatePhone(formData.phone),
       password: validatePassword(formData.password),
       confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
     };
     // Returns true only if ALL validations pass
     return !Object.values(newErrors).some((err) => err !== '');
   };
   ```

#### Visual Feedback:
- Error states with red borders
- Helper text showing requirements
- Prevents submission until all validations pass

---

## 🔄 VALIDATION FLOW

### Login Form:
```
User Types → On Blur → Real-time Validation → On Submit → Final Check → API Call
```

### Registration Form:
```
User Types → On Blur → Real-time Validation → On Submit → Final Check → API Call
```

**Note:** Form submission is **blocked** if any validation fails.

---

## 🛡️ SECURITY BENEFITS

### Password Hashing:
1. ✅ **Protection against database breaches** - Even if database is compromised, passwords cannot be recovered
2. ✅ **Industry standard** - bcrypt is widely used and trusted
3. ✅ **Salt included** - Each password hash is unique even for same password
4. ✅ **One-way function** - Cannot reverse hash to get original password

### Input Validation:
1. ✅ **Prevents invalid data** from reaching the server
2. ✅ **Better user experience** - Immediate feedback
3. ✅ **Reduces server load** - Catches errors early
4. ✅ **Security** - Prevents injection attacks and malformed data
5. ✅ **Data integrity** - Ensures data meets business rules

---

## 📊 SUMMARY

| Feature | Location | Technology |
|---------|----------|------------|
| **Password Hashing (Registration)** | `server/src/controllers/authController.js:27` | bcryptjs (salt rounds: 10) |
| **Password Verification (Login)** | `server/src/controllers/authController.js:66` | bcrypt.compare() |
| **Login Form Validation** | `client/src/components/auth/Login.js:26-86` | React + Regex |
| **Registration Form Validation** | `client/src/components/auth/Register.js:45-199` | React + Regex |

---

## 🎯 KEY TAKEAWAYS FOR PRESENTATION

1. **Passwords are NEVER stored in plain text** - Always hashed with bcrypt
2. **Validation happens on BOTH client and server** - Defense in depth
3. **Real-time feedback** improves user experience
4. **Form submission blocked** until all validations pass
5. **Industry-standard security practices** implemented throughout


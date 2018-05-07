import { FormGroup, FormControl } from '@angular/forms';

export class FormValidators {
    
    static required(control: FormControl) {
        if (control.value == null || control.value.length <= 0)
            return { 'required': false, 'errorMsg': 'Please fill this field.' }
        return null
    }
    
    //  checks if it's a valid positive integer
    static integer(control: FormControl) {
        if (control.value == null || isNaN(control.value) || control.value < 0 || Math.floor(control.value) != control.value)
            return { 'integer': false, 'errorMsg': 'This value has to be a positive integer.' };
        if (control.value > 65535)
            return { 'integer': false, 'errorMsg': 'The value is too high.' };
        return null
    }

    static minLength(minLength: Number) {
        return(control: FormControl) => {
            if (control.value != null && control.value.length > 0 && control.value.length < minLength)
                return { 'minLength': false, 'errorMsg': 'This field must be at least '+minLength+' character long.' }
            return null
        }
    }

    static maxLength(maxLength: Number) {
        return(control: FormControl) => {
            if (control.value != null && control.value.length > 0 && control.value.length > maxLength)
                return { 'maxLength': false, 'errorMsg': 'This field can be maximum '+maxLength+' character long.' }
            return null
        }
    }

    static minValue(min: Number) {
        return(control: FormControl) => {
            if (control.value != null && isNaN(control.value))
                return { 'minValue': false, 'errorMsg': 'Please enter a numeric value.' }
            if (control.value != null && control.value < min)
                return { 'minValue': false, 'errorMsg': 'The value can\'t be less than '+min+'.' }
            return null
        }
    }

    static notZero(control: FormControl) {
        if (control.value.length <= 0)
            return { 'notZero': false, 'errorMsg': 'This value can\'t be zero.' }
        return null
    }
    
    static maxValue(max: Number) {
        return(control: FormControl) => {
            if (control.value != null && isNaN(control.value))
                return { 'minValue': false, 'errorMsg': 'Please enter a numeric value.' }
            if (control.value != null && control.value > max)
                return { 'minValue': false, 'errorMsg': 'The value can\'t be more than '+max+'.' }
            return null
        }
    }
                    
    static validLocation(control: FormControl) {
        if (control.value != null && (!control.value.place_id || control.value.place_id == ''))
            return { 'validLocation': false, 'errorMsg': 'Please select a location.' }
        return null
    }

    static email(control: FormControl) {
        var regex = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
        if (control.value && control.value != '' && !regex.test(control.value))
            return { 'email': false, 'errorMsg': 'This field must be a valid e-mail address.' }
        return null
    }

    static multiple_email(control: FormControl) {
        if (!control.value || control.value == '')
            return null;
        
        var regex = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
        var value = control.value.replace(/ /ig, '');
        var values = value.split(',');
        
        var ok = true;
        for (var t in values)
            if (values[t] != '' && !regex.test(values[t]))
                return { 'multiple_email': false, 'errorMsg': 'Invalid address: '+values[t] }
        return null;
    }

    static token(control: FormControl) {
        var regex = /^[a-zA-Z0-9]+$/i;
        if (control.value != null && !regex.test(control.value))
            return { 'email': false, 'errorMsg': 'This field may only contain letters and numbers.' }
        return null
    }

    static username(control: FormControl) {
        var regex = /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/i;
        if (control.value != null && !regex.test(control.value))
            return { 'username': false, 'errorMsg': 'The username must begin with a letter and may only contain alphanumeric letters, numbers and . or _ characters.' }
        return null
    }

    static validateTime(hrKey: string, minKey: string, secKey: string, msKey: string) {
        return (group: FormGroup): {[key: string]: any} => {
            
            var time = {
                hr: Number(group.controls[hrKey].value),
                min: Number(group.controls[minKey].value),
                sec: Number(group.controls[secKey].value),
                ms: Number(group.controls[msKey].value)
            }
            
            for (var key in time) {
                if (!time[key]) {
                    if (isNaN(time[key]))
                        return { time: true, timeErrorMessage: 'Please enter digits only.'};
                    if (time[key] < 0)
                        return { time: true, timeErrorMessage: 'Please enter positive values only.'};
                    if (Math.floor(time[key]) != time[key])
                        return { time: true, timeErrorMessage: 'Please enter round values only.'};
                }
            }
            
            if (time.hr > 24)
                    return { time: true, timeErrorMessage: 'Hours can\'t be more than 42.'};
            if (time.min > 59)
                    return { time: true, timeErrorMessage: 'Minutes can\'t be more than 59.'};
            if (time.sec > 59)
                    return { time: true, timeErrorMessage: 'Seconds can\'t be more than 59.'};
            if (time.ms > 999)
                    return { time: true, timeErrorMessage: 'Milliseconds can\'t be more than 999.'};
            
            if (time.hr == 0 && time.min == 0 && time.sec == 0)
                    return { time: true, timeErrorMessage: 'Please enter a time which makes sense.'};
            
            return null;
        } 
    }    

    static noFutureDate(control: FormControl) {
        if (!(control.value instanceof Date))
            return { 'noPastDate': true, 'errorMsg': 'Invalid date.' }
        if (control.value > new Date())
            return { 'noPastDate': true, 'errorMsg': 'Please specify a date and time in the past.' }
        return null;
    }

//  -----------------------------------------------------------------------------------------------------
//  Special validators for multiple form fields
//  -----------------------------------------------------------------------------------------------------


    static validatePhone(phoneDistrictKey: string, phoneNumberKey) {
        return (group: FormGroup): {[key: string]: any} => {
            let phoneDistrict = group.controls[phoneDistrictKey];
            let phoneNumber = group.controls[phoneNumberKey];
            if (phoneDistrict.value == null || isNaN(phoneDistrict.value) || phoneDistrict.value.length > 3) return { phone: true, phoneErrorMessage: 'Invalid district code.'};
            if (phoneNumber.value == null || isNaN(phoneNumber.value) || phoneNumber.value.length < 6 || phoneNumber.value.length > 8) return { phone: true, phoneErrorMessage: 'Invalid number.'};
            return null;
        }
    }    

    static validateName(firstNameKey: string, lastNameKey: string) {
        return (group: FormGroup): {[key: string]: any} => {
            let firstName = group.controls[firstNameKey];
            let lastName = group.controls[lastNameKey];
            if (firstName.value == null || firstName.value.length < 2) return { name: true, nameErrorMessage: 'Invalid first name.'};
            if (lastName.value == null || lastName.value.length < 2) return { name: true, nameErrorMessage: 'Invalid last name.'};
            return null;
        } 
    }    

    static validateAddress(cityKey: string, zipKey: string) {
        return (group: FormGroup): {[key: string]: any} => {
            let city = group.controls[cityKey];
            let zip = group.controls[zipKey];
            if (city.value == null || city.value.length < 3) return { address_cityzip: true, addressCityZipErrorMessage: 'Invalid city name.'};
            if (zip.value == null || zip.value.length < 3) return { address_cityzip: true, addressCityZipErrorMessage: 'Invalid postal code.'};
            return null;
        } 
    }    

    static validatePassword(password1Key: string, password2Key: string) {
        return (group: FormGroup): {[key: string]: any} => {
            let password_1 = group.controls[password1Key];
            let password_2 = group.controls[password2Key];
            
            if (password_1.value != password_2.value)
                return { password: true, passwordErrorMessage: 'The two passwords don\'t match.'};
    
            //  at least 8 characters, minimum 1 number, some special chars allowed
            var regex = /^(?=.*[A-Za-z_.?!@#$%^&*()-+=\/\\])(?=.*\d)[A-Za-z_.?!@#$%^&*()-+=\/\\\d]{8,}$/;
            if (!regex.test(password_1.value) || !regex.test(password_2.value)) 
                return { password: true, passwordErrorMessage: 'The password<ul><li>must be at least 8 characters long</li><li>may contain only alphanumeric and punctuation characters</li><li>must contain at least one number</li></ul>' }
            
            return null;
        } 
    }    

}


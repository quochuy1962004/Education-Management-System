export const isValidEmail = (value) => {
    let currentEmails = value.split(',').filter((e) => e && e.trim());
    console.log(currentEmails)
    let regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
    for (let i = 0; i < currentEmails.length; i++) {
        if (!regex.test(currentEmails[i].replace(/\s/g, ''))) {
        return false;
        }
    }
    if (currentEmails.length > 10) return false;
    return true;
  }

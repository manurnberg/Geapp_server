var math = {};

math.diffInYearsFromToday = (dateString) => {
    var today = new Date();
    if(!dateString) return 0;
    var birthDate = new Date(dateString);
    var years = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        years--;
    }
    return years;
};

math.getTimeStampDate = () => {
    let today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
};

module.exports = math;
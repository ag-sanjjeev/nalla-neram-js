/*
 ________________________________________________
(                  Nalla Neram                 ()
\-----------------------------------------------\
|                                               |
|   Copyright 2025 ag-sanjjeev                  |
|                                               |
|-----------------------------------------------|
|   The source code is licensed under           |
|   MIT-style License.                          |
|                                               |
|-----------------------------------------------|
|                                               |
|   The usage, permission and condition         |
|   are applicable to this source code          |
|   as per license.                             |
|                                               |
|-----------------------------------------------|
|                                               |
|   That can be found in LICENSE file           |
|   or at https://opensource.org/licenses/MIT.  |
(_______________________________________________(

*/

// Event Listeners
document.querySelectorAll('.day-selector input[type="radio"]').forEach(function(element) { 
    element.addEventListener('change', function(event) { 
        let dayKey = event.target.value;
        // inactive all other radio labels
        document.querySelectorAll('.day-selector .btn').forEach(function(btn) {
            btn.classList.remove('active');
        });
        // set active for checked radio label 
        event.target.nextElementSibling.classList.add('active');
        let auspiciousTimeSlot = prepareTable(dayKey);
        prepareAuspiciousTimeSlots(auspiciousTimeSlot);
    }); 
});

// Initialization
const today = new Date();
const currentDayIndex = today.getDay();
const currentTamilDay = convertMixedUnicodeToText(tamilDays[currentDayIndex]);
let currentDayInput = document.querySelector(`.day-selector input[type="radio"][value="${currentTamilDay}"]`);

// Proceed with default current day or Sunday
if (currentDayInput) {
    currentDayInput.checked = true;
    currentDayInput.nextElementSibling.classList.add('active'); 
    let auspiciousTimeSlot = prepareTable(currentTamilDay);
    prepareAuspiciousTimeSlots(auspiciousTimeSlot);
} else {
    // Fallback: Activate Sunday and generate its table
    currentDayInput = document.querySelector(`.day-selector input[type="radio"][value="${convertMixedUnicodeToText('ஞாயிறு')}"]`);
    currentDayInput.checked = true;
    currentDayInput.nextElementSibling.classList.add('active'); 
    let auspiciousTimeSlot = prepareTable(currentTamilDay);
    prepareAuspiciousTimeSlots(auspiciousTimeSlot);
}

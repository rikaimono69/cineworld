// datepicker.js

// Объект локализации для AirDatepicker
const enLocale = {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysMin: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'hh:mm aa',
    firstDay: 1
}

document.addEventListener('DOMContentLoaded', () => {

    if (typeof AirDatepicker === 'undefined') {
        console.error("Критический сбой: AirDatepicker не найден.");
        return;
    }

    const dobInput = document.getElementById('date-of-birth');
    const modal = document.querySelector('.js-datepicker-modal');
    const overlay = document.querySelector('.js-datepicker-overlay');
    const body = document.body;
    const content = document.querySelector('.js-datepicker-content');

    if (!dobInput || !modal || !content) {
        console.error("Критический сбой: Не найден один или несколько элементов DOM.");
        return;
    }

    // Запрет ручного ввода
    dobInput.setAttribute('readonly', 'readonly');
    let datepickerInstance = null;

    try {
        // ИНИЦИАЛИЗАЦИЯ AirDatepicker
        datepickerInstance = new AirDatepicker(content, {
            inline: true,
            container: content,
            maxDate: new Date(), 
            autoClose: true,

            // Локализация и формат заголовка
            locale: enLocale,
            navTitles: {
                days: 'MMMM yyyy',
            },

            // Логика при выборе даты
            onSelect({ date, formattedDate }) {
                dobInput.value = formattedDate;
                modal.style.display = 'none';
                body.classList.remove('no-scroll');
            }
        });

        // Открытие модала по клику на поле ввода
        dobInput.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            modal.style.display = 'block';
            // Блокировка скролла, согласно ТЗ
            body.classList.add('no-scroll');
        });

        // Закрытие по клику на оверлей
        overlay.addEventListener('click', () => {
            modal.style.display = 'none';
            body.classList.remove('no-scroll');
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                body.classList.remove('no-scroll');
            }
        });

    } catch (error) {
        console.error("Критический сбой в инициализации AirDatepicker:", error);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const customSelects = document.querySelectorAll('.custom-select');

    customSelects.forEach(selectContainer => {
        // Получаем необходимые DOM элементы
        const header = selectContainer.querySelector('.custom-select__header');
        const currentText = selectContainer.querySelector('.custom-select__current-text');
        const list = selectContainer.querySelector('.custom-select__list');
        const hiddenInput = document.getElementById('hidden-genre-input');

        // --- ИНИЦИАЛИЗАЦИЯ ---

        // Установка начального состояния Placeholder, если значение пустое
        if (!hiddenInput.value) {
            currentText.classList.add('custom-select__current-text_placeholder');
        }

        // --- ОБРАБОТЧИКИ СОБЫТИЙ ---

        // 1. Открытие/закрытие списка при клике на хедер
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            selectContainer.classList.toggle('custom-select_active');
        });

        // 2. Обработка выбора опции
        list.querySelectorAll('.custom-select__option').forEach(option => {
            option.addEventListener('click', () => {
                const newValue = option.getAttribute('data-value');
                const newText = option.textContent.trim();

                // Сброс и установка класса 'selected'
                list.querySelectorAll('.custom-select__option').forEach(opt => {
                    opt.classList.remove('custom-select__option_selected');
                });
                option.classList.add('custom-select__option_selected');

                // Обновление скрытого input (для отправки формы)
                hiddenInput.value = newValue;

                // Обновление видимого текста и стилей
                currentText.textContent = newText;
                currentText.classList.remove('custom-select__current-text_placeholder');
                header.setAttribute('data-value', newValue);

                // Закрытие списка
                selectContainer.classList.remove('custom-select_active');
            });
        });

        // 3. Закрытие при клике вне компонента (с учетом, что может быть открыт календарь)
        document.addEventListener('click', (e) => {
            const clickedInsideDatepicker = e.target.closest('.air-datepicker');
            if (!selectContainer.contains(e.target) && !clickedInsideDatepicker) {
                selectContainer.classList.remove('custom-select_active');
            }
        });
    });
});
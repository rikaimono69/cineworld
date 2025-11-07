document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const registerButton = document.getElementById('register-button');
    const requiredInputs = document.querySelectorAll('input[required]');

    // --- Шаблоны UI элементов ---
    const DOT_HTML = '<span class="field-group__required-dot" aria-hidden="true"></span>';
    const CLEAR_BUTTON_HTML = '<button type="button" class="field-group__clear-button hidden" aria-label="Clear input"></button>';
    const ERROR_MESSAGE_HTML = '<p class="field-group__error-message text-bold-14 hidden">Please enter a valid value</p>';

    // --- Валидаторы ---
    const validators = {
        'name': (value) => /^[a-zA-Z\-'']{2,}$/.test(value.trim()),
        'email': (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        'password': (value) => value.length >= 6,
        'repeat-password': (value, relatedFieldValue) => {
            const password = document.getElementById('password-input').value;
            return value.length >= 6 && value === password;
        },
        'checkbox': (input) => input.checked
    };

    /** Инициализация UI: добавление UX-элементов */
    const initializeFormUI = () => {
        requiredInputs.forEach(input => {
            const formItem = input.closest('.field-group');

            if (input.type === 'text' || input.type === 'email' || input.type === 'password') {
                const inputContainer = document.createElement('div');
                inputContainer.className = 'field-group__input-container';

                formItem.insertBefore(inputContainer, input);
                inputContainer.appendChild(input);

                inputContainer.insertAdjacentHTML('beforeend', DOT_HTML);
                inputContainer.insertAdjacentHTML('beforeend', CLEAR_BUTTON_HTML);

                formItem.insertAdjacentHTML('beforeend', ERROR_MESSAGE_HTML);

            } else if (input.type === 'checkbox') {
                formItem.insertAdjacentHTML('beforeend', ERROR_MESSAGE_HTML);
                formItem.classList.add('checkbox-item');
            }
        });
    };

    /** Валидация совпадения паролей */
    const validatePasswordFields = (strictValidation = false) => {
        const passwordInput = document.getElementById('password-input');
        const repeatPasswordInput = document.getElementById('repeat-password-input');
        const repeatFormItem = repeatPasswordInput.closest('.field-group');
        const errorMessage = repeatFormItem.querySelector('.field-group__error-message');

        const password = passwordInput.value;
        const repeatPassword = repeatPasswordInput.value;

        if (!strictValidation && !repeatFormItem.classList.contains('error')) {
            return true;
        }

        let isValid = true;
        let errorText = 'Please enter a valid value';

        if (repeatPassword && password !== repeatPassword) {
            isValid = false;
            errorText = 'Passwords do not match';
        } else if (!repeatPassword) {
            isValid = false;
        } else if (repeatPassword.length < 6) {
            isValid = false;
            errorText = 'Password must be at least 6 characters';
        }

        if (errorMessage) {
            errorMessage.textContent = errorText;
            if (isValid) {
                repeatFormItem.classList.remove('error');
                errorMessage.classList.remove('show');
            } else {
                repeatFormItem.classList.add('error');
                errorMessage.classList.add('show');
            }
        }

        return isValid;
    };

    /** Валидация одного поля и обновление UI */
    const validateField = (input, strictValidation = false) => {
        const formItem = input.closest('.field-group');
        if (!formItem) return true;

        const validationType = formItem.dataset.validationType;
        const requiredDot = formItem.querySelector('.field-group__required-dot');
        const clearButton = formItem.querySelector('.field-group__clear-button');
        const errorMessage = formItem.querySelector('.field-group__error-message');

        const value = input.type === 'checkbox' ? input.checked : input.value.trim();
        let isFilled = input.type === 'checkbox' ? value : value !== '';
        let isValid = true;

        // Управление точкой/крестиком
        if (input.type !== 'checkbox') {
            if (!isFilled) {
                requiredDot?.classList.remove('hidden');
                clearButton?.classList.add('hidden');
            } else {
                requiredDot?.classList.add('hidden');
                clearButton?.classList.remove('hidden');
            }
        } else {
            // Для чекбокса точка отсутствует
            requiredDot?.classList.toggle('hidden', isFilled);
        }

        // Строгая валидация
        if (strictValidation || formItem.classList.contains('error')) {
            if (isFilled && validationType && validators[validationType]) {
                if (validationType === 'repeat-password') {
                    const password = document.getElementById('password-input').value;
                    isValid = validators[validationType](value, password);
                } else {
                    isValid = validators[validationType](input.type === 'checkbox' ? input : value);
                }
            } else if (!isFilled) {
                isValid = false;
            }

            // Обновление UI ошибки
            if (errorMessage) {
                if (isValid) {
                    formItem.classList.remove('error');
                    errorMessage.classList.remove('show');
                } else {
                    formItem.classList.add('error');
                    errorMessage.classList.add('show');
                    requiredDot?.classList.remove('hidden');
                }
            }
        }

        return isValid;
    };

    /** Управление состоянием кнопки Register (активна, если все заполнено) */
    const updateRegisterButtonState = () => {
        let isAllFilled = true;

        requiredInputs.forEach(input => {
            const value = input.type === 'checkbox' ? input.checked : input.value.trim();
            const isFilled = input.type === 'checkbox' ? value : value !== '';

            if (!isFilled) {
                isAllFilled = false;
            }
        });

        registerButton.disabled = !isAllFilled;
    };

    /** Строгая валидация всей формы (для submit) */
    const validateForm = () => {
        let isFormValid = true;

        requiredInputs.forEach(input => {
            if (!validateField(input, true)) {
                isFormValid = false;
            }
        });

        if (!validatePasswordFields(true)) {
            isFormValid = false;
        }

        return isFormValid;
    };

    // --- Основной запуск и обработчики ---

    initializeFormUI();
    updateRegisterButtonState();

    // Слушатели для ввода/изменения
    requiredInputs.forEach(input => {
        const eventType = input.type === 'checkbox' ? 'change' : 'input';
        input.addEventListener(eventType, () => {
            validateField(input, input.closest('.field-group')?.classList.contains('error'));

            // Проверка паролей при изменении
            if (input.id === 'password-input' || input.id === 'repeat-password-input') {
                validatePasswordFields(input.closest('.field-group')?.classList.contains('error'));
            }

            updateRegisterButtonState();
        });
    });

    // Обработчик для крестика (очистка)
    document.querySelectorAll('.field-group__clear-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const inputContainer = e.target.closest('.field-group__input-container');
            const input = inputContainer?.querySelector('input');

            if (input) {
                input.value = '';
                input.dispatchEvent(new Event('input', { bubbles: true }));

                // Сброс валидации паролей при очистке
                if (input.id === 'password-input' || input.id === 'repeat-password-input') {
                    const passwordInput = document.getElementById('password-input');
                    const repeatInput = document.getElementById('repeat-password-input');
                    const passwordFormItem = passwordInput.closest('.field-group');
                    const repeatFormItem = repeatInput.closest('.field-group');

                    passwordFormItem.classList.remove('error');
                    passwordFormItem.querySelector('.field-group__error-message')?.classList.remove('show');
                    repeatFormItem.classList.remove('error');
                    repeatFormItem.querySelector('.field-group__error-message')?.classList.remove('show');
                }
            }
        });
    });

    // Обработчик отправки формы
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isFormValid = validateForm();
        registerButton.disabled = !isFormValid;

        if (isFormValid) {
            // Переход на страницу успешной регистрации
            window.location.href = 'thanks.html';
        } else {
            // Прокрутка к первой ошибке
            const firstErrorField = document.querySelector('.field-group.error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});
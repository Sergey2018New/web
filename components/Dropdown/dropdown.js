/*
	  -------------
	|   DROPDOWN   |
	  -------------

	* Basic Classes:
		* .js-dropdown - dropdown menu wrapper
		* .js-dropdown-button - popup open/close button
		* .js-dropdown-button-text - button text for opening/closing the popup window
		* .js-dropdown-popup - pop-up window
		* .js-dropdown-list - list of dropdown options
		* .js-dropdown-scroll - scroll of dropdown options
		* .js-dropdown-option - list option
		* .js-dropdown-input - Input when selected from dropdown list
*/

/**
	* @param {Element} dropdownContainer - HTML container element, default document
	* @param {Number} duration - Duration of opening and closing dropdown list
    (also needs to be changed in CSS)
*/

export default function dropdown(dropdownContainer, duration = 300) {
	let dropdowns;

	if (dropdownContainer) {
		if (dropdownContainer instanceof Node) {
			dropdowns = dropdownContainer.querySelectorAll('.js-dropdown');
		}
	} else {
		dropdowns = document.querySelectorAll('.js-dropdown');
	}

	if (dropdowns.length) {
        let isOpeningDropdown = true;

        /**
            * Get active html dropdown element
        */
        const getActiveDropdown = () => {
            return document.querySelector('.js-dropdown.is-active');
        };

        /**
            * The offset of the dropdown list if it extends to the right beyond
            * the window's visibility with
        */
		const calcOffsetDropdown = () => {
			if (getActiveDropdown()) {
				const dropdownActivePopup = getActiveDropdown().querySelector('.js-dropdown-popup');

				if (dropdownActivePopup) {
					dropdownActivePopup.style.removeProperty('margin-left');

					const getBoundingClientRect = dropdownActivePopup.getBoundingClientRect();
					const offsetLeft = getBoundingClientRect.x;
					const width = getBoundingClientRect.width;

					if ((offsetLeft + width + 10) > window.innerWidth) {
						dropdownActivePopup.style.marginLeft = (offsetLeft + width + 10 - window.innerWidth) * (-1) + 'px';
					} else {
						dropdownActivePopup.style.removeProperty('margin-left');
					}
				}
			}
		};

        /**
            * Get focused option
            * @param  {Element} dropdownEl - dropdown html element
        */
        const getFocusedOption = (dropdownEl) => {
            return dropdownEl.querySelector(`.js-dropdown-option.is-focused`);
        };

        /**
            * Close active dropdown list
        */
		const closeDropdownActive = (event) => {
			if (getActiveDropdown() && isOpeningDropdown) {
                isOpeningDropdown = false;

                const dropdownPopup = getActiveDropdown().querySelector('.js-dropdown-popup');
                const dropdownButton = getActiveDropdown().querySelector('.js-dropdown-button');

                if (getFocusedOption(getActiveDropdown())) {
                    getFocusedOption(getActiveDropdown()).classList.remove('is-focused');
                }

                if (dropdownButton && getActiveDropdown()
                && getActiveDropdown().getAttribute('data-dropdown') === 'select') {
                    dropdownButton.focus();
                    event.preventDefault();
                }

				getActiveDropdown().classList.remove('is-active');

                if (dropdownPopup) {
                    dropdownPopup.setAttribute('aria-hidden', true);
                }

                setTimeout(() => {
                    isOpeningDropdown = true;
                }, duration);
			}
		};

        /**
            * Dropdown initialization
            * @param  {Element} dropdownEl - dropdown html element
        */
		const initDropdown = (dropdownEl) => {
            const dropdownType = dropdownEl.getAttribute('data-dropdown-type');
            const dropdownPopup = dropdownEl.querySelector('.js-dropdown-popup');
			const dropdownScroll = dropdownEl.querySelector('.js-dropdown-scroll');
			const dropdownList = dropdownEl.querySelector('.js-dropdown-list');
			const dropdownOptions = dropdownEl.querySelectorAll('.js-dropdown-option');
			const dropdownInput = dropdownEl.querySelector('.js-dropdown-input');
			const dropdownButton = dropdownEl.querySelector('.js-dropdown-button');
            const dropdownButtonText = dropdownEl.querySelector('.js-dropdown-button-text');
            const dropdownButtonColor = dropdownEl.querySelector('.js-dropdown-button-color');
            const optionsCount = dropdownOptions.length;
            const dropdownId = Date.now();
            let optionFocusedIndex = -1;

            /**
                * Get selected option
            */
            const getSelectedOption = () => {
                return dropdownEl.querySelector(
                    `.js-dropdown-option.is-selected`) || false;
            };

            /**
                * Update the state of a focused option
                * @param  {Number} newIndex - Focused option index
            */
            const updateFocusedOption = (newIndex) => {
                const prevOption = dropdownOptions[optionFocusedIndex];
                const option = dropdownOptions[newIndex];

                if (prevOption) {
                    prevOption.classList.remove('is-focused');
                    prevOption.setAttribute('aria-selected', false);
                }
                if (option) {
                    option.classList.add('is-focused');
                    option.setAttribute('aria-selected', true);

                    if (dropdownList) {
                        dropdownList.setAttribute('aria-activedescendant', option.id);
                    }
                }

                optionFocusedIndex = newIndex;
            };

            /**
                * Set scroll to see focused option
            */
            const setScrollTop = () => {
                const focusedOption = getFocusedOption(dropdownEl);

                if (dropdownScroll && focusedOption) {
                    const dropdownScrollHeight = dropdownScroll.clientHeight;
                    const { height } = focusedOption.getBoundingClientRect();
                    const offsetTop = focusedOption.offsetTop;

                    if ((offsetTop + height - dropdownScroll.scrollTop) > dropdownScrollHeight) {
                        dropdownScroll.scrollTop = offsetTop + height - dropdownScrollHeight;
                    }

                    if ((offsetTop - dropdownScroll.scrollTop) < 0) {
                        dropdownScroll.scrollTop = offsetTop;
                    }
                }
            };

            /**
                * Open dropdown list
            */
            const openDropdown = () => {
                if (isOpeningDropdown) {
                    isOpeningDropdown = false;

                    if (getActiveDropdown() && getActiveDropdown() !== dropdownEl) {
                        getActiveDropdown().classList.remove('is-active');
                        dropdownEl.classList.add('is-active');
                    } else {
                        dropdownEl.classList.toggle('is-active');
                    }

                    if (dropdownEl.classList.contains('is-active')) {
                        if (dropdownInput && dropdownInput.hasAttribute('data-datepicker-input')) {
                            dropdownInput.focus();
                        }

                        dropdownPopup.setAttribute('aria-hidden', false);

                        if (dropdownList) {
                            setTimeout(() => {
                                dropdownList.focus();
                            }, duration);
                        }

                        if (dropdownType === 'select') {
                            setScrollTop();
                        }

                        if (dropdownButton) {
                            dropdownButton.setAttribute('aria-expanded', true);
                        }
                    } else {
                        dropdownPopup.setAttribute('aria-hidden', true);

                        if (dropdownButton) {
                            dropdownButton.setAttribute('aria-expanded', false);
                        }
                    }

                    if (dropdownInput && dropdownType === 'select') {
                        const optionSelectedIndex = getSelectedOption() ?
                        [].indexOf.call(dropdownOptions, getSelectedOption()) : -1;

                        updateFocusedOption(optionSelectedIndex);
                    }

                    calcOffsetDropdown();

                    setTimeout(() => {
                        isOpeningDropdown = true;
                    }, duration);
                }
            };

            /**
                * Change dropdown
                * @param  {Element} dropdownOption - HTML option element
                * @param  {Boolean} isChangeEvent - Whether to trigger an input change event
            */
            const changeDropdown = (dropdownOption, isChangeEvent) => {
                if (isOpeningDropdown) {
                    isOpeningDropdown = false;

                    const dropdownOptionSelected = dropdownEl.querySelector('.js-dropdown-option.is-selected');
                    const value = dropdownOption.getAttribute('data-value');
                    const valueText = dropdownOption.getAttribute('data-text-value');
                    const eventChange = new Event('change');

                    if (dropdownOptionSelected) {
                        dropdownOptionSelected.classList.remove('is-selected');
                        dropdownOptionSelected.setAttribute('aria-selected', 'false');
                    }

                    dropdownOption.classList.add('is-selected');
                    dropdownOption.setAttribute('aria-selected', 'true')
                    dropdownEl.classList.remove('is-active');
                    dropdownEl.classList.remove('is-placeholder');

                    if (dropdownList) {
                        dropdownList.setAttribute('aria-activedescendant', dropdownOption.id);
                    }

                    if (dropdownButtonText && dropdownType !== 'color') {
                        dropdownButtonText.textContent = valueText ? valueText : value ? value : '';
                    }

                    if (dropdownButton) {
                        dropdownButton.setAttribute('aria-expanded', false);
                    }

                    if (dropdownInput) {
                        dropdownInput.value = value;
                        dropdownInput.classList.remove('is-error');

                        if (isChangeEvent) {
                            dropdownInput.dispatchEvent(eventChange);
                        }
                    }

                    setTimeout(() => {
                        isOpeningDropdown = true;

                        if (dropdownPopup) {
                            dropdownPopup.setAttribute('aria-hidden', true);
                        }
                    }, duration);
                }
            };

			dropdownEl.setAttribute('data-dropdown-init', '');

            if (dropdownButtonText) {
                dropdownButtonText.id = `dropdown-button-text-${dropdownId}`;
            }

            if (dropdownButton) {
                if (dropdownType === 'select') {
                    dropdownButton.setAttribute('aria-labelledby', dropdownButtonText.id);
                    dropdownButton.id = `dropdown-button-${dropdownId}`;
                }

                dropdownButton.addEventListener('click', () => {
                    openDropdown();
                });
            }

            if (dropdownPopup) {
                dropdownPopup.addEventListener('blur', () => {
                    closeDropdownActive();
                });
            }

			dropdownOptions.forEach((option, index) => {
                option.id = `dropdown-option-${dropdownId}-${index + 1}`;

				option.addEventListener('click', () => {
					changeDropdown(option, true);
                    updateFocusedOption(index);
				});

                option.addEventListener('mouseenter', () => {
					updateFocusedOption(-1);
				});

                option.addEventListener('mouseleave', () => {
					updateFocusedOption(index);
				});
			});

			if (dropdownInput && dropdownType === 'select') {
                const optionSelectedIndex = getSelectedOption() ?
                [].indexOf.call(dropdownOptions, getSelectedOption()) : -1;

				dropdownInput.addEventListener('change', (event) => {
					const optionCurrent = dropdownEl.querySelector(`.js-dropdown-option[data-value="${event.target.value}"]`);

					if (optionCurrent) {
						changeDropdown(optionCurrent);
					}
				});

                updateFocusedOption(optionSelectedIndex);
			}

            dropdownEl.addEventListener('keyup', (e) => {
                // press enter or space
                if ((e.key === 'Enter' || e.code === 'Enter' || e.code === 'Space')) {
                    // -> open dropdown
                    if (document.activeElement === dropdownButton) {
                        openDropdown();
                    }

                    if (document.activeElement.closest('.js-dropdown-list')) {
                        if (dropdownEl.classList.contains('is-active')) {
                            if (getFocusedOption(dropdownEl)) {
                                changeDropdown(getFocusedOption(dropdownEl));
                            } else {
                                closeDropdownActive();
                            }

                            if (dropdownButton) {
                                dropdownButton.focus();
                            }
                        }
                    }
                }
            });

            dropdownEl.addEventListener('keydown', (e) => {
                if ((e.key === 'ArrowDown' || e.code === 'ArrowDown')) {

                    if (optionFocusedIndex < optionsCount - 1) {
                        updateFocusedOption(optionFocusedIndex + 1);
                    } else {
                        updateFocusedOption(0);
                    }

                    setScrollTop();
                    e.preventDefault();
                }

                // press up -> go previous
                if ((e.key === 'ArrowUp' || e.code === 'ArrowUp')) {

                    if (optionFocusedIndex > 0) {
                        updateFocusedOption(optionFocusedIndex - 1);
                    } else {
                        updateFocusedOption(optionsCount - 1);
                    }

                    setScrollTop();
                    e.preventDefault();
                }

                // press tab
                if (e.code === 'Tab' || e.key === 'Tab') {
                    if (dropdownType === 'select'
                        && document.activeElement.closest('.js-dropdown.is-active')) {
                        closeDropdownActive(e);
                    }

                    if (dropdownType === 'menu'
                        && !document.activeElement.closest('.js-dropdown.is-active')) {
                        closeDropdownActive(e);
                    }
                }

                if (e.key === 'Escape' || e.code === 'Escape') {
                    closeDropdownActive(e);
                }
            });
		};

        dropdowns.forEach((dropdownEl, index) => {
            if (!dropdownEl.hasAttribute('data-dropdown-init')) {
                initDropdown(dropdownEl, index);
            }
        });

        document.addEventListener('click', (event) => {
            const { target } = event;

            if (!target.classList.contains('js-dropdown') && !target.closest('.js-dropdown')) {
                closeDropdownActive(event);
			}
        });

        document.addEventListener('keyup', (event) => {
            if ((event.code === 'Tab' || event.key === 'Tab')
                && getActiveDropdown()
                && !document.activeElement.closest('.js-dropdown.is-active')) {
                closeDropdownActive(event);
            }
        });

        window.addEventListener('resize', (event) => {
            calcOffsetDropdown(event);
        });
    }
}

import { Component } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import { Store } from '@ngrx/store';
import { Router, NavigationEnd } from '@angular/router';
import { EmployeeResponseDTO } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/service/employee.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'header',
    templateUrl: './header.html',
    animations: [toggleAnimation],
})
export class HeaderComponent {
    employee: EmployeeResponseDTO | null = null;
    store: any;

    constructor(
        private employeeService: EmployeeService,
        private authService: AuthService,
        public translate: TranslateService,
        public storeData: Store<any>,
        public router: Router,
    ) {
        this.initStore();
    }
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    ngOnInit() {
        const employeeId = localStorage.getItem('employeeId');
            if (employeeId) {
            this.employeeService.getEmployeeById(employeeId).subscribe({
                next: (data) => (this.employee = data),
                error: (err) => console.error('Gagal mengambil data employee:', err),
            });
        } else {
            console.error('employeeId tidak ditemukan di localStorage');
        }
        this.setActiveDropdown();
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.setActiveDropdown();
            }
        });
    }

    setActiveDropdown() {
        const selector = document.querySelector('ul.horizontal-menu a[routerLink="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }

    logout() {
        this.authService.logout().subscribe({
        next: () => {
            localStorage.clear();
            this.router.navigate(['/login']);
        },
        error: (err) => {
            alert('Logout gagal: ' + (err.error?.message || err.statusText));
        }
        });
    }
}

import { AppComponent } from '../app/app.component';

describe('Component', () => {
    it('uploads null file', () => {
        let fileUploadComp: AppComponent = new AppComponent();
        expect(fileUploadComp.sampleMethod).toEqual(42);
    });
});
import expect from 'expect.js';
import { PathFormatter } from '../';

describe('PathFormatter', function(){
    it('should build correct paths', function() {
        let mask = '/abc/project/:projectId/' + //
        'resource/*resourcePath/version/:versionId';
        let params = {
            projectId : 'Project1',
            resourcePath : 'path/to/my/resource.pdf',
            versionId : 'my-new-version'
        };
        let path = PathFormatter.formatPath(mask, params);
        let control = '/abc/project/Project1/' + //
        'resource/path/to/my/resource.pdf/version/my-new-version';
        expect(path).to.eql(control);
    });
});

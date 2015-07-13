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
    it('should be able to use functions as values', function() {
        let mask = '/abc/project/:projectId/' + //
        'resource/*resourcePath/version/:versionId';
        let params = {
            projectId : function(){ return 'Project1' },
            resourcePath : function() { return 'path/to/my/resource.pdf' },
            versionId : function(){ return 'my-new-version' }
        };
        let path = PathFormatter.formatPath(mask, params);
        let control = '/abc/project/Project1/' + //
        'resource/path/to/my/resource.pdf/version/my-new-version';
        expect(path).to.eql(control);
    });
    it('should be able to build path with empty segments', function() {
        function test(mask, params, control){
            let result = PathFormatter.formatPath(mask, params); 
            expect(result).to.eql(control);
        }
        test('x/*b/y', {b: 'A/B/C'}, 'x/A/B/C/y');
        test('x/*b/y', {b: ''}, 'x//y');
        test('x/*b/y', {}, 'x//y');
    });
});

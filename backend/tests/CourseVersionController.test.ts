import request from 'supertest';
import {useExpressServer} from 'routing-controllers';
import Express from 'express';
import {coursesModuleOptions} from 'modules/courses';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {MongoDatabase} from 'shared/database/providers/mongo/MongoDatabase';
import {CourseRepository} from 'shared/database/providers/mongo/repositories/CourseRepository';
import Container from 'typedi';
import {DeleteError} from 'shared/errors/errors';

const App = Express();
let app;
let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  const db = new MongoDatabase(mongoUri, 'vibe');
  Container.set('Database', db);
  const courseRepo = new CourseRepository(db);
  Container.set('NewCourseRepo', courseRepo);
  app = useExpressServer(App, coursesModuleOptions);
});

afterAll(async () => {
  if (app && app.close) {
    await app.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('MODULE DELETE', () => {
  const coursePayload = {
    name: 'New Course',
    description: 'Course description',
  };

  const courseVersionPayload = {
    version: 'New Course Version',
    description: 'Course version description',
  };

  const modulePayload = {
    name: 'New Module',
    description: 'Module description',
  };

  const sectionPayload = {
    name: 'New Section',
    description: 'Section description',
  };

  const itemPayload = {
    name: 'Item1',
    description: 'This is an item',
    type: 'VIDEO',
    videoDetails: {
      URL: 'http://url.com',
      startTime: '00:00:00',
      endTime: '00:00:40',
      points: '10.5',
    },
  };

  describe('Success Scenario', () => {
    console.log('Starting test for module deletion and cascade deletion');

    it('should delete a module and cascade delete its sections and items', async () => {
      const courseResponse = await request(app)
        .post('/courses/')
        .send(coursePayload)
        .expect(200);

      console.log('Course created:', courseResponse.body);

      const courseId = courseResponse.body._id;

      const versionResponse = await request(app)
        .post(`/courses/${courseId}/versions`)
        .send(courseVersionPayload)
        .expect(200);

      console.log('Course version created:', versionResponse.body);

      const versionId = versionResponse.body.version._id;

      const moduleResponse = await request(app)
        .post(`/courses/versions/${versionId}/modules`)
        .send(modulePayload)
        .expect(200);

      console.log('Module created:', moduleResponse.body);

      const moduleId = moduleResponse.body.version.modules[0].moduleId;

      const sectionResponse = await request(app)
        .post(`/versions/${versionId}/modules/${moduleId}/sections`)
        .send(sectionPayload)
        .expect(200);

      console.log('Section created:', sectionResponse.body);

      const sectionId =
        sectionResponse.body.version.modules[0].sections[0].sectionId;

      const itemsGroupId =
        sectionResponse.body.version.modules[0].sections[0].itemsGroupId;

      const itemsGroupResponse = await request(app)
        .post(
          `/versions/${versionId}/modules/${moduleId}/sections/${sectionId}/items`,
        )
        .send(itemPayload)
        .expect(200);

      console.log('Items group created:', itemsGroupResponse.body);

      const deleteModuleResponse = await request(app)
        .delete(`/courses/versions/${versionId}/modules/${moduleId}`)
        .expect(200);

      console.log('Module deleted:', deleteModuleResponse.body);

      expect(deleteModuleResponse.body.deletedItem.moduleId).toBe(moduleId);
    });

    it('should delete a module with multiple sections and items', async () => {
      const courseResponse = await request(app)
        .post('/courses/')
        .send(coursePayload)
        .expect(200);

      const courseId = courseResponse.body._id;

      const versionResponse = await request(app)
        .post(`/courses/${courseId}/versions`)
        .send(courseVersionPayload)
        .expect(200);

      const versionId = versionResponse.body.version._id;

      const moduleResponse = await request(app)
        .post(`/courses/versions/${versionId}/modules`)
        .send(modulePayload)
        .expect(200);

      const moduleId = moduleResponse.body.version.modules[0].moduleId;

      // Add multiple sections and items
      for (let i = 0; i < 3; i++) {
        const sectionResponse = await request(app)
          .post(`/versions/${versionId}/modules/${moduleId}/sections`)
          .send(sectionPayload)
          .expect(200);

        const sectionId =
          sectionResponse.body.version.modules[0].sections[i].sectionId;

        // Add items to the section
        for (let j = 0; j < 2; j++) {
          await request(app)
            .post(
              `/versions/${versionId}/modules/${moduleId}/sections/${sectionId}/items`,
            )
            .send(itemPayload)
            .expect(200);
        }
      }

      const deleteModuleResponse = await request(app)
        .delete(`/courses/versions/${versionId}/modules/${moduleId}`)
        .expect(200);

      expect(deleteModuleResponse.body.deletedItem.moduleId).toBe(moduleId);
    });
  });

  describe('Failure Scenario', () => {
    it('should return 404 if module not found', async () => {
      const invalidModuleId = '5f9b1b3c9d1f1f1f1f1f1f1f';
      const invalidVersionId = '5f9b1b3c9d1f1f1f1f1f1f1f';

      await request(app)
        .delete(
          `/courses/versions/${invalidVersionId}/modules/${invalidModuleId}`,
        )
        .expect(404);
    });

    it('should return 400 for invalid module ID format', async () => {
      const invalidModuleId = '123';
      const invalidVersionId = '123';

      await request(app)
        .delete(
          `/courses/versions/${invalidVersionId}/modules/${invalidModuleId}`,
        )
        .expect(400);
    });
  });

  describe('Edge Cases', () => {
    it('should handle no sections in the module', async () => {
      const courseResponse = await request(app)
        .post('/courses/')
        .send(coursePayload)
        .expect(200);

      const courseId = courseResponse.body._id;

      const versionResponse = await request(app)
        .post(`/courses/${courseId}/versions`)
        .send(courseVersionPayload)
        .expect(200);

      const versionId = versionResponse.body.version._id;

      const moduleResponse = await request(app)
        .post(`/courses/versions/${versionId}/modules`)
        .send(modulePayload)
        .expect(200);

      const moduleId = moduleResponse.body.version.modules[0].moduleId;

      const deleteModuleResponse = await request(app)
        .delete(`/courses/versions/${versionId}/modules/${moduleId}`)
        .expect(200);

      expect(deleteModuleResponse.body.deletedItem.moduleId).toBe(moduleId);
    });

    it('should handle sections with no items', async () => {
      const courseResponse = await request(app)
        .post('/courses/')
        .send(coursePayload)
        .expect(200);

      const courseId = courseResponse.body._id;

      const versionResponse = await request(app)
        .post(`/courses/${courseId}/versions`)
        .send(courseVersionPayload)
        .expect(200);

      const versionId = versionResponse.body.version._id;

      const moduleResponse = await request(app)
        .post(`/courses/versions/${versionId}/modules`)
        .send(modulePayload)
        .expect(200);

      const moduleId = moduleResponse.body.version.modules[0].moduleId;

      const sectionResponse = await request(app)
        .post(`/versions/${versionId}/modules/${moduleId}/sections`)
        .send(sectionPayload)
        .expect(200);

      const deleteModuleResponse = await request(app)
        .delete(`/courses/versions/${versionId}/modules/${moduleId}`)
        .expect(200);

      expect(deleteModuleResponse.body.deletedItem.moduleId).toBe(moduleId);
    });

    it('should handle course version not found', async () => {
      const invalidVersionId = '5f9b1b3c9d1f1f1f1f1f1f1f';
      const moduleId = '5f9b1b3c9d1f1f1f1f1f1f1f';

      const deleteModuleResponse = await request(app)
        .delete(`/courses/versions/${invalidVersionId}/modules/${moduleId}`)
        .expect(404);

      expect(deleteModuleResponse.body.message).toContain(
        'Course Version not found',
      );
    });
  });
});
